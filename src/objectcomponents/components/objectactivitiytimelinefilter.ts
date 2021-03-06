/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef, Input,
    OnInit, Renderer2, ElementRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiy-timeline-filter',
    templateUrl: './src/objectcomponents/templates/objectactivitytimelinefilter.html'
})
export class ObjectActivityTimelineFilter {

    private isOpen: boolean = false;
    clickListener: any;

    activityObjects: Array<any> = ['Tasks', 'Meetings', 'Calls', 'Notes', 'Emails'];
    activityTypes: Array<any> = [];

    objectfilters: Array<any> = [];
    ownerfilter: string = '';

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private language: language, private metadata: metadata, private activitiyTimeLineService: activitiyTimeLineService) {
        this.setFromService();
    }

    setFromService(){
        this.objectfilters = JSON.parse(JSON.stringify(this.activitiyTimeLineService.filters.objectfilters));
        this.ownerfilter = this.activitiyTimeLineService.filters.own;
    }

    setToService(){
        this.activitiyTimeLineService.filters.objectfilters = JSON.parse(JSON.stringify(this.objectfilters));
        this.activitiyTimeLineService.filters.own = this.ownerfilter;

        this.activitiyTimeLineService.reload();
    }

    toggleOpen() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }

    public onClick(event: MouseEvent): void {

        // buildTypes
        this.buildTypes();

        // regitser the click listener
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isOpen = false;
            this.clickListener();
        }
    }

    buildTypes() {
        this.activityTypes = [];

        for (let activityObject of this.activityObjects) {
            this.activityTypes.push({
                type: activityObject,
                name: this.language.getModuleName(activityObject)
            })
        }

        this.activityTypes.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        })
    }

    get filterColorClass() {
        return this.activitiyTimeLineService.filters.objectfilters.length > 0 || this.activitiyTimeLineService.filters.own ? 'slds-icon-text-error' : 'slds-icon-text-default' ;
    }

    setFilter(event, filter) {
        event.preventDefault();
        if (filter == 'all') {
            this.objectfilters = [];
        } else {
            let index = this.objectfilters.indexOf(filter);
            if (index >= 0) {
                this.objectfilters.splice(index, 1);
            } else {
                this.objectfilters.push(filter);
            }
        }
    }

    getChecked(filter) {
        if (filter == 'all') {
            return this.objectfilters.length == 0 ? true : false;
        } else {
            return this.objectfilters.indexOf(filter) >= 0 ? true : false;
        }
    }

    closeDialog(apply) {
        if (this.clickListener)
            this.clickListener();

        if(apply){
            this.setToService();
        } else {
            this.setFromService();
        }

        this.isOpen = false;
    }

}