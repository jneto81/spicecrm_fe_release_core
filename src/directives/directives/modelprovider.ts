/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Directive, Input} from '@angular/core';
import {model} from "../../services/model.service";



/**
 * a directive that does nothing else but to provide a model service instance, populated by an model like object
 * author: sebastian franz
 */
@Directive({
    selector: '[modelProvider]',
    providers: [model]
})
export class ModelProviderDirective
{
    /*
    @Input('modelProvider') provided_model:{
        module:string,
        id:string,
        data:any,
    };
    */

    constructor(
        private model:model
    ){
        // in case the host component is listening to the loading status and waits for it!
        this.model.isLoading = true;
        //console.log('model is loading...');
    }

    @Input('modelProvider')
    set provided_model(provided_model:{module:string, id:string, data:any})
    {
        this.model.module = provided_model.module;
        if( provided_model.id )
        {
            this.model.id = provided_model.id;
        }
        else if( provided_model.data )
        {
            this.model.id = provided_model.data.id;
        }

        if( provided_model.data )
        {
            this.model.data = provided_model.data;
            this.model.isLoading = false;
            this.model.data$.emit();

            if(provided_model.data.acl)
            {
                // has to be called again after the data is set because of the missing acl before...
                this.model.initializeFieldsStati();
            }
        }
        else if( this.model.id )
        {
            // if no data was found BUT an ID, load it from backend... isLoading will be set inside getData()
            this.model.getData();
        }

    }

}