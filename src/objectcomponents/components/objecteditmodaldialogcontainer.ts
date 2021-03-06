/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-edit-modal-dialog-container',
    templateUrl: './src/objectcomponents/templates/objecteditmodaldialogcontainer.html'
})
export class ObjectEditModalDialogContainer implements AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef}) private container: ViewContainerRef;
    private componentRefs: Array<any> = [];
    @Input() private componentSet: String = '';
    @Input() private module: String = '';

    constructor(private model: model, private metadata: metadata) {

    }

    public ngAfterViewInit() {
        this.renderComponentSet();
    }

    private renderComponentSet() {

        for (let component of this.componentRefs) {
            component.destroy();
        }

        if(!this.componentSet || this.componentSet == '') {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
            this.componentSet = componentconfig.componentset;
        }
        for (let thisComponent of this.metadata.getComponentSetObjects(this.componentSet)) {
            this.metadata.addComponent(thisComponent.component, this.container).subscribe(componentRef => {
                componentRef.instance.componentconfig = thisComponent.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

}