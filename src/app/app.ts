import { Component, signal } from '@angular/core';
import actionsData from './db.actions.json';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';

interface Film {
  name: string;
  code: string;
}

interface PsychicAttack {
  label: string;
  value: number;
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
    SelectButtonModule,
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
  selectedLocation: Film | undefined;
  girl!: Film[];
  selectedGirl: Film | null = null;
  psychicAttackValue: PsychicAttack = { label: '0', value: 0 };
  canTakeClimb: boolean = false;
  canTakeLeap: boolean = false;
  canTakeClimbAndLeap: boolean = false;
  time: number = 0;
  horror: number = 0;
  psychicAttackOptions: PsychicAttack[] = [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
  ];

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
      { name: 'Slayer', code: 'slayer' },
    ];
    this.location = [
      { name: 'Maple Lane', code: 'maplelane' },
      { name: 'Sacred Groves', code: 'sacredgroves' },
      { name: 'Station 2891', code: 'station' },
      { name: 'Hellscape', code: 'hellscape' },
      { name: 'Marrek Wharehouse', code: 'marrek' },
      { name: 'Larmes Abbey', code: 'abbey' },
      { name: 'Sunnydaze Mall', code: 'sunnydaze' },
    ];
    this.girl = [
      { name: 'Carolyn Revenge', code: 'carolyn' },
      { name: 'Gradma Grudge', code: 'grandma' },
    ];

    this.tableauActions = this.orderListByName(
      actionsData.filter((action) => action.category === 'core' && action.cost > 0),
    );

    this.playActions = this.orderListByName(
      actionsData.filter((action) => action.category === 'core' && action.cost === 0),
    );
  }

  endTurn() {
    if (this.selectedGirl && this.selectedGirl.code === 'carolyn') {
      this.discardActions = this.discardActions.filter((action) => action.img !== 'phychicattack');
      const psychicAttackInPlay = this.playActions.filter((action) => action.img === 'phychicattack');
      this.psychicAttackValue = {
        label: psychicAttackInPlay.length.toString(),
        value: psychicAttackInPlay.length,
      };
    }
    this.tableauActions = [...this.tableauActions, ...this.discardActions];
    this.tableauActions = this.orderListByName(this.tableauActions);
    this.playActions = [...this.playActions, ...this.handActions];
    this.playActions = this.orderListByName(this.playActions);
    this.handActions = [];
    this.discardActions = [];
    this.time = 6;
  }

  orderListByName(list: any[]) {
    const listOrder = list.sort((a, b) => a.name.localeCompare(b.name));
    return listOrder;
  }

  signatureChange(event: any) {
    if(event.checked) {
      this.addRandomSignatureAction();
    } else {
      this.tableauActions = this.tableauActions.filter((action) => action.category !== 'signature');
    }
  }

  addRandomSignatureAction() {
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
/*       const marrekActions = actionsData.filter((action) => action.category === 'marrek');
      this.playActions = [...this.playActions, ...marrekActions];
      this.playActions = this.orderListByName(this.playActions); */

      // if 
      return;
    }

    const locationActions = actionsData.filter(
      (action) => action.category === this.selectedLocation?.code,
    );
    this.tableauActions = [...this.tableauActions, ...locationActions];
    this.tableauActions = this.orderListByName(this.tableauActions);
  }

  changeGirl() {
    if (this.selectedGirl && this.selectedGirl.code === 'grandma') {
      this.playActions = this.playActions.filter((action) => action.img !== 'shortrest');
      this.playActions = this.playActions.filter((action) => action.img !== 'walk');
      this.tableauActions = this.tableauActions.filter((action) => action.img !== 'sprint');
      this.tableauActions = this.tableauActions.filter((action) => action.img !== 'longrest');
      this.playActions = this.orderListByName(this.playActions);

      const grandmaTableauActions = actionsData.filter(
        (action) => action.category === 'grandma' && action.cost > 0,
      );
      this.tableauActions = [...this.tableauActions, ...grandmaTableauActions];
      this.tableauActions = this.orderListByName(this.tableauActions);

      const grandmaPlayActions = actionsData.filter(
        (action) => action.category === 'grandma' && action.cost === 0,
      );
      this.playActions = [...this.playActions, ...grandmaPlayActions];
      this.playActions = this.orderListByName(this.playActions);

      return;
    }

    if (this.selectedGirl && this.selectedGirl.code === 'carolyn') {
      const carolynTableauActions = actionsData.filter(
        (action) => action.category === 'carolyn' && action.cost > 0,
      );
      this.tableauActions = [...this.tableauActions, ...carolynTableauActions];
      this.tableauActions = this.orderListByName(this.tableauActions);
      return;
    }
  }

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

  onMoveTableauToHand(event: any) {
    const cost = event.items.reduce((sum: number, action: any) => sum + (action.cost ?? 0), 0);
    if (this.time === 0 || cost > this.time) {
      // Revert: move items back to tableau
      this.handActions = this.handActions.filter((a) => !event.items.includes(a));
      this.tableauActions = this.orderListByName([...this.tableauActions, ...event.items]);
      return;
    }
    this.time -= cost;
  }

  onMoveHandToTableau(event: any) {
    const cost = event.items.reduce((sum: number, action: any) => sum + (action.cost ?? 0), 0);
    this.time += cost;
  }

  onActionMouseEnter(action: any) {
    this.hoveredActionImg = action.img;
  }

  onActionMouseLeave() {
    this.hoveredActionImg = null;
  }

  onChangeCarolynAttack() {
    if (this.psychicAttackValue.value === 0) {
      this.playActions = this.playActions.filter((action) => action.img !== 'psychicattack');
      this.playActions = this.orderListByName(this.playActions);
      return;
    }
    if (this.psychicAttackValue.value === 1) {
      this.playActions = this.playActions.filter((action) => action.img !== 'psychicattack');
      this.playActions = this.orderListByName(this.playActions);
      const psychicAttackAction = actionsData.find((action) => action.id === 62);
      this.playActions = [...this.playActions, psychicAttackAction];
      this.playActions = this.orderListByName(this.playActions);
      return;
    }
    if (this.psychicAttackValue.value === 2) {
      this.playActions = this.playActions.filter((action) => action.img !== 'psychicattack');
      this.playActions = this.orderListByName(this.playActions);
      const psychicAttackAction = actionsData.find((action) => action.id === 62);
      this.playActions = [...this.playActions, psychicAttackAction];
      const psychicAttackAction2 = actionsData.find((action) => action.id === 63);
      this.playActions = [...this.playActions, psychicAttackAction2];
      this.playActions = this.orderListByName(this.playActions);
      return;
    }
  }

  increaseHorror() {
    if(this.horror < 7) {
      this.horror += 1;
    }
  }

  decreaseHorror() {
    if(this.horror > 0) {
      this.horror -= 1;
    }
  }

  decreaseTime() {
    if(this.time > 0) {
      this.time -= 1;
    }
  }

  increaseTime() {
    if(this.time < 12) {
      this.time += 1;
    }
  }

  takeClimb() {

  }

  takeLeap() {

  }

  takeClimbAndLeap() {

  }
  
}
