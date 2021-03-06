/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {backend} from './backend.service';
import {fts} from './fts.service';
import {userpreferences} from './userpreferences.service';
import {language} from './language.service';
import {metadata} from "./metadata.service";
import {broadcast} from "./broadcast.service";
import {session} from "./session.service";

declare var moment: any;

@Injectable()
export class modellist implements OnDestroy {
    public module: string = '';
    public modulefilter: string = '';
    public listtype: string = 'all';
    public listtype$: EventEmitter<String>;
    public listData: any = {
        list: [],
        totalcount: 0
    };
    public listSelected: any = {
        type: '',
        items: []
    };
    public lastFields: Array<any> = [];
    public sortfield: string = '';
    public sortdirection: string = 'ASC';
    public lastLoad: any = new moment();

    public loadlimit: number = 50;
    public isLoading: boolean = false;

    public searchConditions: any[] = [];
    public searchTerm: string = '';
    public searchAggregates: Array<any> = [];
    public selectedAggregates: Array<any> = [];

    public standardLists: Array<any> = [
        {
            id: 'all',
            type: 'all',
            name: '<LBL_ALL> <module>',
            basefilter: 'all',
            config: {
                showSearch: true,
                enableFilter: false,
                enableAggregates: true,
                enableDelete: false
            }
        }, {
            id: 'owner',
            type: 'owner',
            basefilter: 'own',
            name: '<LBL_MY> <module>',
            config: {
                showSearch: true,
                enableFilter: false,
                enableAggregates: true,
                enableDelete: false
            }
        }
        // todo: implement recent
        /*, {
         id: 'recent',
         type: 'recent',
         basefilter: 'rec',
         name: 'Recently Viewed <module>',
         config: {
         showSearch: false,
         enableFilter: false,
         enableDelete: false
         }

         }*/
    ];
    public listTypes: Array<any> = [];
    public currentList: any = {};
    public serviceSubscriptions: Array<any> = [];

    constructor(
        private broadcast: broadcast,
        private backend: backend,
        private fts: fts,
        private metadata: metadata,
        private language: language,
        private userpreferences: userpreferences,
        private session: session,
    ) {
        // create the event Emitter
        this.listtype$ = new EventEmitter<String>();

        // subscribe to the broadcast service
        this.serviceSubscriptions.push(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    public handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.module) {
            return;
        }

        switch (message.messagetype) {
            case 'model.delete':
                for (let itemIndex in this.listData.list) {
                    if (this.listData.list[itemIndex].id === message.messagedata.id) {
                        this.listData.list.splice(itemIndex, 1);
                        this.listData.totalcount--;
                    }
                }
                break;
            case 'model.save':
                let eventHandled = false;
                for (let itemIndex in this.listData.list) {
                    if (this.listData.list[itemIndex].id === message.messagedata.id) {
                        this.listData.list[itemIndex] = message.messagedata.data;
                        eventHandled = true;
                    }
                }
                if (!eventHandled) {
                    this.reLoadList();
                }
                break;
        }
    }

    public ngOnDestroy() {
        // unsubscribe from broadcast
        for (let serviceSubscription of this.serviceSubscriptions) {
            serviceSubscription.unsubscribe();
        }
    }

    public setModule(module: string) {
        this.module = module;

        // get the custom listtypes
        this.listTypes = [];
        for (let listtype of this.metadata.getModuleListTypes(this.module)) {
            this.addCustomListtype(listtype.id, listtype.name, listtype.basefilter, listtype.fielddefs, listtype.filterdefs, listtype.global);
        }

        // check if we have preferences set for the user
        let modulepreferences = this.userpreferences.getPreference(module);
        if (modulepreferences && modulepreferences.lastlisttype) {
            this.setListType(modulepreferences.lastlisttype);
        } else {
            this.setListType('all', false);
        }
    }

    public setSortField(field: string) {
        if (this.sortfield == field) {
            this.sortdirection = this.sortdirection == 'ASC' ? 'DESC' : 'ASC';
        } else {
            this.sortfield = field;
            this.sortdirection = 'ASC';
        }
        this.reLoadList();
    }

    public addCustomListtype(id, name, basefilter, fielddefs, filterdefs, global): void {
        this.listTypes.push({
            id: id,
            type: 'custom',
            name: name,
            global: global,
            basefilter: basefilter,
            fielddefs: fielddefs,
            filterdefs: filterdefs,
            config: {
                showSearch: false,
                enableFilter: true,
                enableDelete: true
            }
        });
    }

    public setListType(listType: string, setPreference = true): void {
        this.listtype = listType;
        for (let thisListType of this.getListTypes()) {
            if (thisListType.id === listType) {
                this.currentList = thisListType;
            }
        }

        // set the user preferences
        if (setPreference) {
            let modulepreferences = this.userpreferences.getPreference(this.module);
            if (!modulepreferences) {
                modulepreferences = {};
            }
            modulepreferences.lastlisttype = listType;
            this.userpreferences.setPreference(this.module, modulepreferences);
        }

        // emit the change
        this.listtype$.emit(listType);
    }

    public checkFilterChange(listType): boolean {
        return (listType.basefilter !== this.currentList.basefilter || listType.filterdefs !== this.currentList.filterdefs);
    }

    public canDelete(): boolean {
        try {
            return this.currentList.config.enableDelete;
        } catch (e) {
            return false;
        }
    }

    public filterEnabled() {
        try {
            return this.currentList.config.enableFilter;
        } catch (e) {
            return false;
        }
    }

    public aggregatesEnabled() {
        try {
            return this.currentList.config.enableAggregates;
        } catch (e) {
            return false;
        }
    }

    /*
     getter functions
     */

    public getListTypeName(listType: string = '') {
        if (!listType) {
            listType = this.currentList.id;
        }
        // return this.currentList.name;

        for (let thisListType of this.getListTypes()) {
            if (thisListType.id === listType) {
                return thisListType.name;
            }
        }
    }

    public getGlobal(): boolean {
        return this.currentList.global;
    }

    public getBaseFilter(): string {
        return this.currentList.basefilter;
    }

    public getFieldDefs(): Array<any> {
        try {
            return JSON.parse(atob(this.currentList.fielddefs));
        } catch (e) {
            return [];
        }
    }

    public getFilterDefs(): Array<any> {
        try {
            return JSON.parse(atob(this.currentList.filterdefs));
        } catch (e) {
            return [];
        }
    }

    public addListType(name, global): Observable<boolean> {
        let retSub = new Subject<boolean>();
        let listParams = {
            list: name,
            global: global
        };
        this.backend.addListType(this.module, listParams).subscribe((listdata: any) => {

            this.addCustomListtype(listdata.id, listdata.name, 'all', null, null, listdata.global);

            // ad it to the metadata colection as well
            this.metadata.addModuleListType(this.module, {
                id: listdata.id,
                type: 'custom',
                name: listdata.name,
                basefilter: 'all',
                fielddefs: null,
                filterdefs: null,
                config: {
                    showSearch: false,
                    enableFilter: true,
                    enableDelete: true
                }
            });

            this.setListType(listdata.id);
            retSub.next(true);
            retSub.complete();
        });
        return retSub.asObservable();
    }

    public updateListType(listParams): Observable<boolean> {
        let retSub = new Subject<boolean>();
        this.backend.setListType(this.currentList.id, this.module, listParams).subscribe((listdata: any) => {

            this.listTypes.some(item => {
                if (item.id == this.currentList.id) {

                    for (let key in listParams) {
                        if (listParams.hasOwnProperty(key)) {
                            item[key] = listParams[key];
                        }
                    }
                    this.currentList = item;
                    return true;
                }
            });
            listParams.id = this.currentList.id;
            this.metadata.updateModuleListType(this.module, listParams);

            // emit since changes might impact others
            this.listtype$.emit(this.currentList);

            // return message to Observable and complete it
            retSub.next(true);
            retSub.complete();
        });
        return retSub.asObservable();
    }

    public deleteListType(id: string = ''): Observable<boolean> {
        let retSub = new Subject<boolean>();
        if (id === '') {
            id = this.currentList.id;
        }
        this.backend.deleteListType(id).subscribe(res => {
            // set the new default listtype
            this.setListType('all');

            // remove the deleted listtype from the current list
            this.listTypes.some((item, index) => {
                if (item.id == id) {
                    this.listTypes.splice(index, 1);
                    return true;
                }
            });

            // return the Observable and complete the subject
            retSub.next(true);
            retSub.complete();
        });
        return retSub.asObservable();
    }

    public getLastLoadTime(): string {
        return this.lastLoad.format('HH:mm');
        // return this.lastLoad.toLocaleDateString() + ' ' + this.lastLoad.getHours() + ':' + this.lastLoad.getMinutes();
    }

    public getListData(fields: Array<any>): Observable<boolean> {
        this.resetListData();

        // check if we have fields defined or use the last fields
        if (!fields) {
            fields = this.lastFields;
        } else {
            this.lastFields = fields;
        }

        // check if we have a sortfield or shoudl set one
        if (!this.sortfield) {
            this.sortfield = fields.length > 0 ? fields[0] : 'id';
        }

        return this.loadList(fields);
    }

    public showSearch(listType) {
        if (!listType) {
            listType = this.listtype;
        }
        for (let thisListType of this.getListTypes()) {
            if (thisListType.id === listType) {
                return thisListType.config.showSearch;
            }
        }
        return false;
    }

    public loadFilteredList(fields: any[]) {
        this.isLoading = true;

        let retSub = new Subject<boolean>();
        this.resetListData();

        this.backend.getList(this.module, this.sortfield, this.sortdirection, fields, {
            start: 0,
            limit: this.loadlimit,
            listid: this.currentList.id,
            searchterm: this.searchTerm,
            searchfields: {
                join: 'AND',
                conditions: this.searchConditions,
            },
        }).subscribe(
            res => {
                this.listData = res;
                this.lastLoad = new moment();

                this.isLoading = false;

                retSub.next(true);
                retSub.complete();
            }
        );
        return retSub.asObservable();
    }

    public loadMoreList() {
        if (this.isLoading || this.listData.list.length >= this.listData.totalcount) {
            return false;
        }

        this.isLoading = true;

        if (this.currentList.type == 'all') {
            this.fts.loadMore().subscribe(res => {
                let newItems = [];
                for (let item of res[this.module].hits) {
                    item._source.acl = item.acl;
                    newItems.push(item._source);
                }

                this.listData.list = this.listData.list.concat(newItems);
                this.lastLoad = new moment();

                this.isLoading = false;

            });
        } else {
            this.backend.getList(this.module, this.sortfield, this.sortdirection, this.lastFields, {
                start: this.listData.list.length,
                limit: this.loadlimit,
                listid: this.currentList.id
            })
                .subscribe((res: any) => {
                    this.listData.list = this.listData.list.concat(res.list);
                    this.lastLoad = new moment();

                    this.isLoading = false;

                });
        }
    }

    public loadMoreFilteredList() {
        if (this.isLoading || this.listData.list.length >= this.listData.totalcount) {
            return false;
        }

        this.isLoading = true;
        let retSub = new Subject<boolean>();
        this.backend.all(this.module, {
            // this.backend.getList(this.module, this.sortfield, this.sortdirection, this.lastFields, {
            offset: this.listData.list.length,
            limit: this.loadlimit,
            listid: this.currentList.id,
            sortfield: this.sortfield,
            sortdirection: this.sortdirection,
            searchterm: this.searchTerm,
            searchfields: {
                join: 'AND',
                conditions: this.searchConditions,
            },
        }).subscribe(
            res => {
                this.listData.list = this.listData.list.concat(res);
                this.lastLoad = new moment();

                this.isLoading = false;

                retSub.next(true);
                retSub.complete();
            }
        );

        return retSub;
    }

    public reLoadList() {
        return this.loadList(this.lastFields);
    }

    public resetListData() {
        this.listData = {
            list: [],
            totalcount: 0
        };
    }

    public getListTypes(base = true) {
        let listTypes: Array<any> = [];

        if (base) {
            for (let list of this.standardLists) {
                listTypes.push({
                    id: list.id,
                    type: list.type,
                    global: 1,
                    name: list.name.replace('<module>', this.language.getModuleName(this.module)).replace('<LBL_MY>', this.language.getLabel('LBL_MY')).replace('<LBL_ALL>', this.language.getLabel('LBL_ALL')),
                    basefilter: list.basefilter,
                    config: list.config
                });
            }
        }

        for (let list of this.listTypes) {
            listTypes.push(list);
        }

        return listTypes;
    }

    public hasAggregates() {
        return this.selectedAggregates.length > 0;
    }

    public setAggregate(aggregate, aggdata) {
        this.selectedAggregates.push(aggregate + '::' + aggdata);
        this.reLoadList();
    }

    public checkAggregate(aggregate, aggdata) {
        return this.selectedAggregates.indexOf(aggregate + '::' + aggdata.trim()) > -1;
    }

    public removeAggregate(aggregate, aggdata) {
        let index = this.selectedAggregates.indexOf(aggregate + '::' + aggdata);
        if (index >= 0) {
            this.selectedAggregates.splice(index, 1);
            this.reLoadList();
        }
    }

    public removeAllAggregates() {
        this.selectedAggregates = [];
        this.reLoadList();
    }

    /*
     * select functions
     */
    public setAllSelected() {
        this.listSelected.type = 'all';
        for (let listItem of this.listData.list) {
            listItem.selected = true;
        }
    }

    public setAllUnselected() {
        this.listSelected.type = 'none';
        for (let listItem of this.listData.list) {
            listItem.selected = false;
        }
    }

    public getSelectedCount() {
        let selCount = 0;
        for (let listItem of this.listData.list) {
            if (listItem.selected) {
                selCount++;
            }
        }
        return selCount;
    }

    public getSelectedItems() {
        let items = [];
        for (let listItem of this.listData.list) {
            if (listItem.selected) {
                items.push(listItem);
            }
        }
        return items;
    }

    /**
     * checks the access by action for the current list
     * @param {string} action
     * @returns {boolean}
     */
    public checkAccess(action: string) {
        if (this.currentList.global) {
            switch (action) {
                case 'delete':
                    return this.canDelete() && this.session.authData.admin;
                case 'edit':
                    return this.session.authData.admin;
                default:
                    return false;
            }
        } else {
            switch (action) {
                default:
                    return true;
            }
        }

    }

    private loadList(fields: Array<any>): Observable<boolean> {
        this.isLoading = true;

        let retSub = new Subject<boolean>();
        this.resetListData();
        if (this.currentList.type == 'all' || this.currentList.type == 'owner') {
            let aggregates = {};
            aggregates[this.module] = this.selectedAggregates;
            this.fts.searchByModules(this.searchTerm, [this.module], this.loadlimit, aggregates, {
                sortfield: this.sortfield,
                sortdirection: this.sortdirection.toLowerCase()
            }, this.currentList.type == 'owner' ? true : false,
                this.modulefilter).subscribe(res => {
                // console.log(res);
                let result = {list: [], totalcount: res[this.module].total};
                for (let item of res[this.module].hits) {
                    item._source.acl = item.acl;
                    item._source.acl_fieldcontrol = item.acl_fieldcontrol;
                    result.list.push(item._source);
                }
                this.listData = result;

                // set the aggegates
                this.searchAggregates = res[this.module].aggregations;

                // set the last load
                this.lastLoad = new moment();

                // cancel that we are loading
                this.isLoading = false;

                retSub.next(true);
                retSub.complete();
            });
        } else {
            this.backend.getList(this.module, this.sortfield, this.sortdirection, fields, {
                start: 0,
                limit: this.loadlimit,
                listid: this.currentList.id,
                modulefilter: this.modulefilter
            }).subscribe(
                res => {
                    this.listData = res;
                    this.lastLoad = new moment();

                    this.isLoading = false;

                    retSub.next(true);
                    retSub.complete();
                }
            );
        }
        return retSub.asObservable();
    }
}
