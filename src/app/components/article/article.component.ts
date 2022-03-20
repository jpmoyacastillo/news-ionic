import { Component, Input } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { Article } from '../../interfaces/index';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  @Input() article: Article;
  @Input() index: number;

  constructor(
    private platform: Platform,
    private iab: InAppBrowser,
    private actionSheetCtrl: ActionSheetController
  ) {}

  openArticle() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }

    window.open(this.article.url, '_blank');
  }

  async articleOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Compartir',
          icon: 'share-outline',
          handler: () => this.onShareArticle(),
        },
        {
          text: 'Favorito',
          icon: 'heart-outline',
          handler: () => this.onToggleFavorite(),
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  onShareArticle() {
    console.log('share article');
  }

  onToggleFavorite() {
    console.log('toggle favorite');
  }
}
