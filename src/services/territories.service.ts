/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {CanActivate}    from '@angular/router';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {metadata} from './metadata.service';
import {backend} from './backend.service';

@Injectable()
export class territories {

    userTerritories: any = {};
    addTerritories: any = {};

    constructor(private backend: backend, private metadata: metadata, private configurationService: configurationService, private session: session) {

    }

    getTerritories(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('territorries'+this.session.authData.sessionId)] && sessionStorage[window.btoa('territorries'+this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            this.userTerritories = this.session.getSessionData('territorries');
            loadhandler.next('getTerritorries');
        } else {
            this.loadTerritories().subscribe(() => {
                loadhandler.next('getTerritorries');
            });
        }
    }

    loadTerritories() {
        let retSubject = new Subject();

        let modules: Array<String> = [];
        for (let module of this.metadata.getModules()) {
            if (module !== 'Home')
                modules.push(module);
        }

        this.backend.getRequest('territories')
            .subscribe(response => {
                this.session.setSessionData('territorries',response);
                this.userTerritories = response;

                retSubject.next(true);
                retSubject.complete();
            });

        return retSubject.asObservable();
    }

    loadTerritoryName(territory) {
        this.addTerritories[territory] = '...';
        this.backend.getRequest('territories/' + territory)
            .subscribe((response: any) => {
                if (response.id === territory)
                    this.addTerritories[territory] = response.name;
                else
                    this.addTerritories[territory] = 'error';
            });
    }

    searchTerritories(module, searchterm, items = 5, activeterritories = []){
        let retArray = [];

        for(let territory of this.userTerritories[module]){
            if(territory.name.indexOf(searchterm) >= 0 && activeterritories.indexOf(territory.id) < 0){
                retArray.push(territory);
            }

            // check if we did reach the number we are looking for
            if(retArray.length >= items){
                return retArray;
            }
        }

        return retArray
    }

    isUserTerritory(module, territory){
        let userTerritory: boolean = false;
        this.userTerritories[module].some(thisTerritorry => {
            if (thisTerritorry.id === territory) {
                userTerritory = true;
                return true;
            }
        })

        return userTerritory;
    }

    getTerritoryName(module, territory) {
        let territoryName = '';
        this.userTerritories[module].some(thisTerritorry => {
            if (thisTerritorry.id === territory) {
                territoryName = thisTerritorry.name;
                return true;
            }
        })

        if (territoryName === '') {
            if (!this.addTerritories[territory]){
                this.loadTerritoryName(territory);
            }
            territoryName = this.addTerritories[territory];
        }
        return territoryName;
    }

}