/*
SpiceUI 1.1.0

This file is part of SpiceCRM in its "More" Editions and thus is licensed and copyrighted software. Your installation or use of this SpiceCRM file is subject to the license agreement you entered regaridng the use of SpiceCRM with aac services k.s or any of its affiliates and partners.

If you are unsure about your licese agreement please contat aac services k.s. at office@all-about-crm.com

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
*/

"use strict";var __decorate=this&&this.__decorate||function(e,s,t,i){var a,l=arguments.length,o=l<3?s:null===i?i=Object.getOwnPropertyDescriptor(s,t):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,s,t,i);else for(var n=e.length-1;0<=n;n--)(a=e[n])&&(o=(l<3?a(o):3<l?a(s,t,o):a(s,t))||o);return 3<l&&o&&Object.defineProperty(s,t,o),o},__metadata=this&&this.__metadata||function(e,s){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,s)};Object.defineProperty(exports,"__esModule",{value:!0});var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),services_1=require("../../services/services"),services_2=require("../../services/services"),services_3=require("../../services/services"),services_4=require("../../services/services"),services_5=require("../../services/services"),services_6=require("../../services/services"),services_7=require("../../services/services"),services_8=require("../../services/services"),services_9=require("../../services/services"),objectfields_1=require("../../objectfields/objectfields"),globalcomponents_1=require("../../globalcomponents/globalcomponents"),objectcomponents_1=require("../../objectcomponents/objectcomponents"),systemcomponents_1=require("../../systemcomponents/systemcomponents"),Home=function(){function Home(e,s,t,i){this.broadcast=e,this.navigation=s,this.elementRef=t,this.metadata=i,this.componentconfig={},this.navigation.setActiveModule("Home");var a=this.metadata.getComponentConfig("Home","Home");a&&a.HomeAssistant&&(this.componentconfig=a.HomeAssistant)}return Home.prototype.getHomeStyle=function(){return{height:"calc(100vh - "+this.elementRef.nativeElement.getBoundingClientRect().top+"px)",overflow:"auto"}},Home.prototype.displayHomeAssistant=function(){return void 0===this.componentconfig.HomeAssistant||this.componentconfig.HomeAssistant},Home=__decorate([core_1.Component({template:'<div class="slds-grid" [ngStyle]="getHomeStyle()" *ngIf="displayHomeAssistant()"><div class="slds-col slds-size--3-of-4"><home-dashboard></home-dashboard></div><div class="slds-col slds-size--1-of-4"><home-assistant></home-assistant></div></div><div class="slds-grid" [ngStyle]="getHomeStyle()" *ngIf="!displayHomeAssistant()"><div class="slds-col slds-size--1-of-1"><home-dashboard></home-dashboard></div></div>'}),__metadata("design:paramtypes",[services_4.broadcast,services_5.navigation,core_1.ElementRef,services_1.metadata])],Home)}();exports.Home=Home;var HomeAssistant=function(){function e(e,s,t){this.assistant=e,this.navigation=s,this.language=t,this.assistant.initlaize()}return e.prototype.reload=function(){this.assistant.loadItems()},Object.defineProperty(e.prototype,"loading",{get:function(){return this.assistant.loading},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"noActivities",{get:function(){return!this.assistant.loading&&0==this.assistant.assitantItems.length},enumerable:!0,configurable:!0}),e=__decorate([core_1.Component({selector:"home-assistant",template:'<div class="slds-panel slds-grid slds-grid--vertical slds-nowrap slds-p-vertical--medium"><div class="slds-p-horizontal--small slds-p-vertical--small"><div class="slds-grid slds-grid--align-spread slds-has-flexi-truncate slds-grid--vertical-align-center"><h1 class="slds-page-header__title slds-m-right--small slds-align-middle slds-truncate">{{language.getLabel(\'LBL_ASSISTANT\')}}</h1><div class="slds-shrink-none"><home-assistant-filter></home-assistant-filter><system-utility-icon [icon]="\'refresh\'" [size]="\'x-small\'" (click)="reload()" [title]="language.getLabel(\'LBL_REFRESH\')"></system-utility-icon></div></div><home-assistant-tile *ngFor="let item of assistant.assitantItems" [item]="item"></home-assistant-tile></div><div *ngIf="loading" class="slds-p-around--medium"><system-spinner></system-spinner></div><div *ngIf="noActivities" class="slds-p-around--medium slds-align--absolute-center"><h2 class="slds-text-heading--small">{{language.getLabel(\'LBL_NO_ACTIVITIES\')}}</h2></div><div class="slds-form--stacked slds-grow slds-scrollable--y slds-grid slds-grid--vertical"></div></div>'}),__metadata("design:paramtypes",[services_7.assistant,services_5.navigation,services_3.language])],e)}();exports.HomeAssistant=HomeAssistant;var HomeAssistantTile=function(){function HomeAssistantTile(e,s,t,i){this.language=e,this.model=s,this.view=t,this.metadata=i,this.item={},this.tileFields=[],this.actionset="",t.isEditable=!1}return HomeAssistantTile.prototype.ngOnInit=function(){var e=this.metadata.getComponentConfig("HomeAssistantTile",this.item.module);e&&e.fieldset&&(this.tileFields=this.metadata.getFieldSetFields(e.fieldset)),e&&e.actionset&&(this.actionset=e.actionset),this.model.module=this.item.module,this.model.id=this.item.id,this.model.data=this.item.data},HomeAssistantTile.prototype.goDetail=function(){this.model.goDetail()},__decorate([core_1.Input(),__metadata("design:type",Object)],HomeAssistantTile.prototype,"item",void 0),HomeAssistantTile=__decorate([core_1.Component({selector:"home-assistant-tile",template:'<div class="slds-tile slds-media slds-m-vertical--medium slds-border--bottom slds-p-bottom--small"><div class="slds-media__figure"><system-icon [module]="item.module" [size]="\'small\'"></system-icon></div><div class="slds-media__body"><div class="slds-grid slds-grid--align-spread slds-has-flexi-truncate"><h3 class="slds-truncate slds-text-heading--small slds-p-bottom--xx-small"><a href="javascript:void(0);" (click)="goDetail()">{{item.data.summary_text}}</a></h3><div class="slds-shrink-none"><object-actionset-menu [buttonsize]="\'x-small\'" [actionset]="actionset"></object-actionset-menu></div></div><div class="slds-text-body--small"><dl class="slds-list--horizontal slds-wrap"><ng-container *ngFor="let tileField of tileFields"><dt class="slds-item--label slds-text-color--weak slds-truncate">{{language.getFieldDisplayName(model.module, tileField.field)}}</dt><dd class="slds-item--detail slds-truncate"><field-container [field]="tileField.field" [fieldconfig]="tileField.fieldconfig" [fielddisplayclass]="\'slds-truncate\'"></field-container></dd></ng-container></dl></div></div></div>',providers:[services_2.model,services_8.view]}),__metadata("design:paramtypes",[services_3.language,services_2.model,services_8.view,services_1.metadata])],HomeAssistantTile)}();exports.HomeAssistantTile=HomeAssistantTile;var HomeAssistantFilter=function(){function e(e,s,t,i,a){this.renderer=e,this.elementRef=s,this.language=t,this.metadata=i,this.assistant=a,this.isOpen=!1,this.activityObjects=["Tasks","Meetings","Calls","Opportunities","Reminders"],this.activityTypes=[],this.objectfilters=[],this.timefilter="all",this.setFromService()}return e.prototype.setFromService=function(){this.objectfilters=JSON.parse(JSON.stringify(this.assistant.assistantFilters.objectfilters)),this.timefilter=JSON.parse(JSON.stringify(this.assistant.assistantFilters.timefilter))},e.prototype.setToService=function(){this.assistant.assistantFilters.objectfilters=JSON.parse(JSON.stringify(this.objectfilters)),this.assistant.assistantFilters.timefilter=JSON.parse(JSON.stringify(this.timefilter)),this.assistant.loadItems()},e.prototype.toggleOpen=function(){var s=this;this.isOpen=!this.isOpen,this.isOpen?this.clickListener=this.renderer.listen("document","click",function(e){return s.onClick(e)}):this.clickListener&&this.clickListener()},e.prototype.onClick=function(e){this.buildTypes(),this.elementRef.nativeElement.contains(e.target)||(this.isOpen=!1,this.clickListener())},e.prototype.buildTypes=function(){this.activityTypes=[];for(var e=0,s=this.activityObjects;e<s.length;e++){var t=s[e];this.activityTypes.push({type:t,name:this.language.getModuleName(t)})}this.activityTypes.sort(function(e,s){return e.name>s.name?1:-1})},Object.defineProperty(e.prototype,"filterColorClass",{get:function(){return 0<this.assistant.assistantFilters.objectfilters.length||"all"!=this.assistant.assistantFilters.timefilter?"slds-icon-text-error":"slds-icon-text-default"},enumerable:!0,configurable:!0}),e.prototype.setFilter=function(e,s){if(e.preventDefault(),"all"==s)this.objectfilters=[];else{var t=this.objectfilters.indexOf(s);0<=t?this.objectfilters.splice(t,1):this.objectfilters.push(s)}},e.prototype.getChecked=function(e){return"all"==e?0==this.objectfilters.length:0<=this.objectfilters.indexOf(e)},e.prototype.closeDialog=function(e){this.clickListener&&this.clickListener(),e?this.setToService():this.setFromService(),this.isOpen=!1},e=__decorate([core_1.Component({selector:"home-assistant-filter",template:'<div class="slds-dropdown-trigger slds-dropdown-trigger_click slds-p-horizontal--xxx-small" [ngClass]="{\'slds-is-open\': isOpen}"><system-utility-icon [icon]="\'filterList\'" [size]="\'x-small\'" (click)="toggleOpen()" [colorclass]="filterColorClass" [title]="language.getLabel(\'LBL_FILTER\')"></system-utility-icon><div class="slds-is-absolute slds-dropdown slds-dropdown_right slds-nubbin_top-right" style="right:-10px;top:25px;"><div class="slds-grid"><div class="slds-p-horizontal--small slds-border--right" style="min-width: 180px"><div class="slds-p-vertical--x-small">{{language.getLabel(\'LBL_TYPE\')}}</div><div class="slds-form-element slds-p-vertical--xx-small"><div class="slds-form-element__control" (click)="setFilter($event, \'all\')"><span class="slds-checkbox"><input type="checkbox" id="alltypes" [checked]="getChecked(\'all\')"> <label class="slds-checkbox__label" for="alltypes"><span class="slds-checkbox_faux"></span> <span class="slds-form-element__label">{{language.getLabel(\'LBL_ALL\')}}</span></label></span></div></div><div class="slds-form-element slds-p-vertical--xx-small" *ngFor="let activityType of activityTypes"><div class="slds-form-element__control" (click)="setFilter($event, activityType.type)"><span class="slds-checkbox"><input type="checkbox" [id]="activityType.type" [checked]="getChecked(activityType.type)"> <label class="slds-checkbox__label" [attr.for]="activityType.type"><span class="slds-checkbox_faux"></span> <span class="slds-form-element__label">{{activityType.name}}</span></label></span></div></div></div><div class="slds-p-horizontal--small" style="min-width: 180px"><div class="slds-p-vertical--x-small">{{language.getLabel(\'LBL_FILTER\')}}</div><fieldset class="slds-form-element"><div class="slds-form-element__control"><span class="slds-radio"><input type="radio" id="timeall" name="filters" value="all" [(ngModel)]="timefilter"> <label class="slds-radio__label" for="timeall"><span class="slds-radio_faux"></span> <span class="slds-form-element__label">{{language.getLabel(\'LBL_ALL\')}}</span></label></span> <span class="slds-radio"><input type="radio" id="timeoverdue" name="filters" value="overdue" [(ngModel)]="timefilter"> <label class="slds-radio__label" for="timeoverdue"><span class="slds-radio_faux"></span> <span class="slds-form-element__label">{{language.getLabel(\'LBL_OVERDUE\')}}</span></label></span> <span class="slds-radio"><input type="radio" id="timetoday" name="filters" value="today" [(ngModel)]="timefilter"> <label class="slds-radio__label" for="timetoday"><span class="slds-radio_faux"></span> <span class="slds-form-element__label">{{language.getLabel(\'LBL_TODAY\')}}</span></label></span></div></fieldset></div></div><footer class="slds-popover__footer"><div class="slds-grid"><button class="slds-col--bump-left slds-button slds-button_neutral" (click)="closeDialog(false)">{{language.getLabel(\'LBL_CANCEL\')}}</button> <button class="slds-button slds-button--brand" (click)="closeDialog(true)">{{language.getLabel(\'LBL_APPLY\')}}</button></div></footer></div></div>'}),__metadata("design:paramtypes",[core_1.Renderer2,core_1.ElementRef,services_3.language,services_1.metadata,services_7.assistant])],e)}();exports.HomeAssistantFilter=HomeAssistantFilter;var HomeDashboard=function(){function HomeDashboard(e,s,t,i){var a=this;this.broadcast=e,this.navigation=s,this.metadata=t,this.session=i,this.componentSubscriptions=[],this.dashboardid="",this.dashboardcontainercomponent=void 0,this.componentSubscriptions.push(this.broadcast.message$.subscribe(function(e){a.handleMessage(e)})),this.loadDashboardConfig()}return HomeDashboard.prototype.handleMessage=function(e){switch(e.messagetype){case"applauncher.setrole":this.loadDashboardConfig()}},HomeDashboard.prototype.loadDashboardConfig=function(){var e=this.metadata.getComponentConfig("HomeDashboard","Home");e.dashboardid&&(this.dashboardid=e.dashboardid,this.dashboardcontainercomponent&&(this.dashboardcontainercomponent.instance.dashboardid=this.dashboardid))},HomeDashboard.prototype.ngAfterViewInit=function(){var s=this;this.metadata.addComponent("DashboardContainer",this.dashboardcontainer).subscribe(function(e){e.instance.dashboardid=s.dashboardid,e.instance.context="Home",s.dashboardcontainercomponent=e})},HomeDashboard.prototype.ngOnDestroy=function(){for(var e=0,s=this.componentSubscriptions;e<s.length;e++){s[e].unsubscribe()}},__decorate([core_1.ViewChild("dashboardcontainer",{read:core_1.ViewContainerRef}),__metadata("design:type",core_1.ViewContainerRef)],HomeDashboard.prototype,"dashboardcontainer",void 0),HomeDashboard=__decorate([core_1.Component({selector:"home-dashboard",template:'<div style="background-color: #f7f9fb" class="slds-p-vertical--medium slds-p-horizontal--medium"><div #dashboardcontainer></div></div>'}),__metadata("design:paramtypes",[services_4.broadcast,services_5.navigation,services_1.metadata,services_6.session])],HomeDashboard)}();exports.HomeDashboard=HomeDashboard;var ModuleHome=function(){function ModuleHome(e){this.vms=e,this.version="1.0",this.build_date="2018-10-22",this.vms.registerModule(this)}return ModuleHome=__decorate([core_1.NgModule({imports:[common_1.CommonModule,forms_1.FormsModule,objectfields_1.ObjectFields,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,systemcomponents_1.SystemComponents],declarations:[Home,HomeAssistant,HomeAssistantTile,HomeAssistantFilter,HomeDashboard]}),__metadata("design:paramtypes",[services_9.VersionManagerService])],ModuleHome)}();exports.ModuleHome=ModuleHome;