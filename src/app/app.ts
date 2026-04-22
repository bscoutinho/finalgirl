import { Component, signal } from '@angular/core';
import actionsData from './db.actions.json';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

interface Film {
  name: string;
  code: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    PickListModule,
    ButtonModule,
    TooltipModule,
    ToggleButtonModule,
    SelectModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('finalgirl');

  protected tableauActions: any[] = [];
  protected tableauActionsSelected: any[] = [];
  protected handActions: any[] = [];
  protected playActions: any[] = [];
  protected playActionsSelected: any[] = [];
  protected discardActions: any[] = [];
  isSignature: boolean = false;
  killer!: Film[];
  selectedKiller!: Film;
  location!: Film[];
  selectedLocation!: Film;
  girl!: Film[];
  selectedGirl!: Film;

  hoveredActionImg: string | null = null;

  ngOnInit() {
    this.killer = [
      { name: 'Inkanyamba', code: 'inkanyamba' },
      { name: 'Ratchet Lady', code: 'ratchet' },
      { name: 'Evomorph', code: 'evomorph' },
      { name: 'Berith', code: 'berith' },
      { name: 'The Organism', code: 'organism' },
      { name: 'Terror from Destiny', code: 'destiny' },
      { name: 'Slayer', code: 'slayer' },
      { name: 'Volkar', code: 'volkar' },
      { name: 'Mort', code: 'mort' },
    ];
    this.location = [
      { name: 'Maple Lane', code: 'maplelane' },
      { name: 'Sacred Groves', code: 'sacredgroves' },
      { name: 'Station 2891', code: 'station' },
      { name: 'Hellscape', code: 'hellscape' },
      { name: 'Marrek Wharehouse', code: 'marrek' },
      { name: 'Larmes Abbey', code: 'abbey' },
    ];
    this.girl = [
      { name: 'Carolyn Revenge', code: 'carolyn' },
      { name: 'Gradma Grudge', code: 'grandma' },
    ];

    // Initialize tableauActions with all actions with category "core" and cost bigger than 0
    this.tableauActions = this.orderListByName(
      actionsData.filter((action) => action.category === 'core' && action.cost > 0),
    );

    // Initialize playActions with all actions with category "core" and cost equal to 0
    this.playActions = this.orderListByName(
      actionsData.filter((action) => action.category === 'core' && action.cost === 0),
    );
  }

  endTurn() {
    this.tableauActions = [...this.tableauActions, ...this.discardActions];
    this.tableauActions = this.orderListByName(this.tableauActions);
    this.playActions = [...this.playActions, ...this.handActions];
    this.playActions = this.orderListByName(this.playActions);
    this.handActions = [];
    this.discardActions = [];
  }

  orderListByName(list: any[]) {
    const listOrder = list.sort((a, b) => a.name.localeCompare(b.name));
    return listOrder;
  }

  signatureChange() {
    const signatureActions = actionsData.filter((action) => action.category === 'signature');
    if (signatureActions.length > 0) {
      const randomIndex = Math.floor(Math.random() * signatureActions.length);
      const randomAction = signatureActions[randomIndex];
      this.tableauActions.push(randomAction);
      this.tableauActions = this.orderListByName(this.tableauActions);
    }
  }

  changeKiller() {
    if (
      this.selectedKiller &&
      this.selectedKiller.code === 'inkanyamba' &&
      this.selectedLocation &&
      this.selectedLocation.code === 'sacredgroves'
    ) {
      return;
    }
    const killerActions = actionsData.filter(
      (action) => action.category === this.selectedKiller.code,
    );
    this.tableauActions = [...this.tableauActions, ...killerActions];
    this.tableauActions = this.orderListByName(this.tableauActions);

    
  }

  changeLocation() {
    if (
      this.selectedKiller &&
      this.selectedKiller.code === 'inkanyamba' &&
      this.selectedLocation &&
      this.selectedLocation.code === 'sacredgroves'
    ) {
      return;
    }

    if (this.selectedLocation && this.selectedLocation.code === 'marrek') {
      const marrekActions = actionsData.filter((action) => action.category === 'marrek');
      this.playActions = [...this.playActions, ...marrekActions];
      this.playActions = this.orderListByName(this.playActions);
      return;
    }

    const locationActions = actionsData.filter(
      (action) => action.category === this.selectedLocation.code,
    );
    this.tableauActions = [...this.tableauActions, ...locationActions];
    this.tableauActions = this.orderListByName(this.tableauActions);
  }

  changeGirl() {}

  takeFreeCards() {
    const freeActions = this.tableauActions.filter((action) => action.cost === 0);
    this.handActions = [...this.handActions, ...freeActions];
    this.handActions = this.orderListByName(this.handActions);
    this.tableauActions = this.tableauActions.filter((action) => action.cost !== 0);
  }

  onPlayActionSelect(event: any) {
    this.playActionsSelected = event.items;
  }
  onTableauActionSelect(event: any) {
    this.tableauActionsSelected = event.items;
  }
  
  onActionMouseEnter(action: any) {
    this.hoveredActionImg = action.img;
  }

  onActionMouseLeave() {
    this.hoveredActionImg = null;
  }
}
