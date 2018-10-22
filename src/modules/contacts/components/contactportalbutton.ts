/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, HostBinding, ViewContainerRef} from "@angular/core";
import {Router} from "@angular/router";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: "contact-portal-button",
    templateUrl: "./src/modules/contacts/templates/contactportalbutton.html",
    host: {
        "class": "slds-button slds-button--neutral",
        "[style.display]": "getDisplay()",
        "(click)" : "showPortalDetails()"
    },
    styles: [
        ":host >>> {cursor:pointer;}"
    ]
})
export class ContactPortalButton {

    constructor(private language: language, private model: model,  private metadata: metadata, private modal: modal, private ViewContainerRef: ViewContainerRef) {
    }

    private getDisplay() {
        return (!this.model.data.email1 && !this.model.data.email_address_private) || this.model.isEditing || (this.model.data.acl && !this.model.data.acl.edit) ? "none" : "inherit"
    }

    private showPortalDetails() {
        this.modal.openModal("ContactPortalDetails", true, this.ViewContainerRef.injector).subscribe(popup => {

        });
    }

}