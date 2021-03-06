/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, AfterViewInit, ViewContainerRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'global-header-tools',
    templateUrl: './src/globalcomponents/templates/globalheadertools.html'
})
export class GlobalHeaderTools implements AfterViewInit {

    @ViewChild('toolcontainer', {read: ViewContainerRef}) private toolcontainer: ViewContainerRef;
    private containerItems: any[] = [];

    constructor(private session: session, private metadata: metadata, private router: Router, private language: language, private broadcast: broadcast) {
        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    public ngAfterViewInit() {
        this.buildTools();
    }

    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
            case 'loader.reloaded':
                this.buildTools();
                break;

        }
    }

    private buildTools() {

        // destrioy the current container
        this.containerItems.forEach(item => {
            item.destroy();
        });
        this.containerItems = [];

        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderTools');
        if (!componentconfig.componentset) return false;
        let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
        for (let component of components) {
            this.metadata.addComponent(component.component, this.toolcontainer).subscribe(itemRef => {
                this.containerItems.push(itemRef);
            });
        }
    }

}
