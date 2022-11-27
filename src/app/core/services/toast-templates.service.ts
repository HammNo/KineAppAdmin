import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastTemplatesService {
  constructor(private readonly toastrCtrl: ToastController) {}

  async alreadyConnected() {
    (
      await this.toastrCtrl.create({
        message: 'Vous êtes déjà connecté.',
        duration: 2000,
        color: 'success',
        cssClass: 'center-text',
        position: 'bottom',
      })
    ).present();
  }

  async authSuccess(){
    (await this.toastrCtrl.create({
      message : "L'authentification a réussi!",
      duration : 2000,
      color : 'success',
      cssClass: 'center-text',
      position : 'bottom',

    })).present();
  }

  async authFail(){
    (await this.toastrCtrl.create({
      message : 'Veuillez entrer un identifiant et un mot de passe corrects.',
      duration : 2000,
      color : 'warning',
      cssClass: 'center-text',
      position : 'bottom',
    })).present();
  }

  async logout(){
    (await this.toastrCtrl.create({
      message : 'Déconnexion réussie, au revoir.',
      duration : 2000,
      color : 'success',
      cssClass: 'center-text',
      position : 'bottom',
    })).present();
  }

  async getWeekFail(){
    (await this.toastrCtrl.create({
      message : "Attention, cette semaine n'a pas été implémentée.",
      duration : 2000,
      color : 'warning',
      cssClass: 'center-text',
      position : 'bottom',
    })).present();
  }

  async dayRevealSuccess(){
    (await this.toastrCtrl.create({
      message : "Le jour est maintenant visible.",
      duration : 2000,
      color : 'success',
      cssClass: 'center-text',
      position : 'bottom',
    })).present();
  }

  async weekAddSuccess(){
    (await this.toastrCtrl.create({
      message : "La semaine a été correctement implémentée.",
      duration : 2000,
      color : 'success',
      cssClass: 'center-text',
      position : 'bottom',
    })).present();
  }
}
