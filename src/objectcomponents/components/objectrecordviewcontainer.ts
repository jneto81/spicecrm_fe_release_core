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
    AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';

//var System = require('../../../../node_modules/systemjs/dist/system.js');

@Component({
    selector: 'object-recordview-container',
    templateUrl: './src/objectcomponents/templates/objectrecordviewcontainer.html',
    providers: [model]
})
export class ObjectRecordViewContainer implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
    module: string = '';
    id: string = '';
    initialized: boolean = false;
    componentRefs: Array<any> = [];

    routeSubscribe: any = {};
    componentSubscriptions: Array<any> = [];

    constructor(private navigation: navigation,
                private activatedRoute: ActivatedRoute,
                private metadata: metadata,
                private model: model,
                private broadcast: broadcast,
                private elementref: ElementRef) {

        this.routeSubscribe = this.activatedRoute.params.subscribe(params => {
            this.module = params['module'];
            this.id = params['id'];

            // console.log('activeRouteParams ', params);

            // set theenavigation paradigm
            this.navigation.setActiveModule(this.module);

            if (this.initialized)
                this.buildContainer();

        });
        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));


    }

    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;

        }
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    ngOnDestroy() {
        // destroy subcomponents
        for (let component of this.componentRefs) {
            component.destroy();
        }

        // unsubscribe from Observables
        for (let componentSubscription of this.componentSubscriptions) {
            componentSubscription.unsubscribe();
        }
    }

    buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordViewContainer', this.module);
        for (let view of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(view.component, this.container).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = view.componentconfig;
                this.componentRefs.push(componentRef);
            })
        }

    }
}