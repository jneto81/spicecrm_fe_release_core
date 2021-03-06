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
    Component,
    Injectable,
    Pipe,
    PipeTransform,
    Input,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    ElementRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {modelutilities} from '../../services/modelutilities.service';
import {broadcast} from '../../services/broadcast.service';
import {userpreferences} from '../../services/userpreferences.service';
import {spiceprocess} from '../services/spiceprocess';

declare var moment: any;

@Component({
    selector: '[spice-timestream-header]',
    templateUrl: './src/addcomponents/templates/spicetimestreamheader.html'
})
export class SpiceTimestreamHeader {

    @Input() timestream: any = {};

    dateElements: Array<any> = [];

    constructor(private elementRef: ElementRef, private userpreferences: userpreferences) {

    }

    get startDate(){
        return this.timestream.datestart.format(this.userpreferences.getDateFormat());
    }

    get endDate(){
        return this.timestream.dateend.format(this.userpreferences.getDateFormat());
    }

    get width(){
        return this.elementRef.nativeElement.parentElement.getBoundingClientRect().width;
    }

    get periods(){
        let periods = [];
        let i = 0;
        switch(this.timestream.period){
            case 'M':
                let weekdate = moment(this.timestream.dateStart);
                while(weekdate.isSameOrBefore(this.timestream.dateEnd) ){

                    periods.push({
                        name: weekdate.format('DD'),
                        displayclass: weekdate.day() == 0 || weekdate.day() == 6 ? 'slds-theme_shade' : ''
                    })
                    weekdate.add(1, 'd');
                }
                break;
            case 'Q':
                while(i < 3){
                    let date = new moment().month(this.timestream.dateStart.month() + i);
                    periods.push({
                        name: date.format('MMM')
                    })
                    i++;
                }
                break;
            case 'y':
                while(i < 12){
                    let date = new moment().month(i);
                    periods.push({
                        name: date.format('MMM')
                    })
                    i++;
                }
                break;
        }

        return periods;
    }

    getPeriodStyle(){
        return {
            width: 'calc(100% / ' + this.periods.length + ')'
        }
    }

}