import { AlertController, ToastController, } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonList, IonItemSliding, IonNote, IonItemOption, IonIcon, IonItemOptions, IonText, IonBadge} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonBadge, CommonModule,IonText, FormsModule, IonItemOptions, IonIcon, IonItemOption, IonNote, IonItemSliding, IonList, IonButton, IonSelectOption, IonSelect, IonInput, IonLabel, IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  Harcamalar: any[]=[];
  HarcamaAdi: string="";
  HarcamaTutari: number | null=null;
  HarcamaKategorisi: string="";
  Toplam: number=0;
  constructor(
    private alertController: AlertController,
    private toastController: ToastController
){
    this.VerileriYukle();
  }

  async ToastMesajıGoster(mesaj: string, renk:string) {
    const toast = await this.toastController.create({
      message: mesaj,
      duration: 2000,
      color: renk,
      position:'bottom'
    });
   await toast.present();
  }

  VerileriYukle(){
    const KayitliVeri= localStorage.getItem('Harcamalarım');
    if (KayitliVeri){
      this.Harcamalar= JSON.parse(KayitliVeri);
      this.ToplamHesapla();
    }
  }
  ToplamHesapla() {
    this.Toplam= this.Harcamalar.reduce((Toplam, h) => {
      return Toplam+ (Number(h.Tutar) || 0);
    }, 0);
  }
  VerileriKaydet(){
    localStorage.setItem('Harcamalarım', JSON.stringify(this.Harcamalar));
    this.ToplamHesapla();
  }
  HarcamaEkle(){
    if (this.HarcamaAdi.trim() && this.HarcamaTutari !== null &&this.HarcamaTutari > 0 && this.HarcamaKategorisi) {
      const yeni={
        Ad: this.HarcamaAdi,
        Tutar: this.HarcamaTutari,
        Kategori: this.HarcamaKategorisi,
        Tarih: new Date().toLocaleDateString('tr-TR'),
        Saat: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})
      };
      this.Harcamalar.push(yeni);
      this.VerileriKaydet();
      this.ToastMesajıGoster('Harcama başarıyla eklendi.','primary')

      this.HarcamaAdi= "";
      this.HarcamaTutari=null;
      this.HarcamaKategorisi="";
    }
    else if (this.HarcamaAdi && this.HarcamaKategorisi && (this.HarcamaTutari===null || this.HarcamaTutari<=0)) {
      this.ToastMesajıGoster('Lütfen geçerli bir tutar giriniz.','danger');
    }
    
    else{
      this.ToastMesajıGoster('Lütfen tüm alanları eksiksiz doldurunuz.', 'warning');
    }
  }
   async Sil(h: any){
     const alert = await this.alertController.create({
      header: ' Uyarı',
      message: `${h.Ad} harcamasını silmek istediğinizden emin misiniz?`,
      buttons: [
        { text: 'Vazgeç', 
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Sil',
          handler: ()=> {
            const index = this.Harcamalar.indexOf(h);
            if (index > -1){
              this.Harcamalar.splice(index, 1);
              this.VerileriKaydet();
              this.ToastMesajıGoster('Harcama silindi.', 'danger');
            }
          }
        }
      ]
     });
     await alert.present();
    }

    KategoriRenk( Kategori: any){
      const konrtol= Kategori ? Kategori.toString().trim(): '';
      switch (konrtol){
        case 'Gıda': 
          return 'secondary';
        case 'Ulaşım':  
          return 'dark';
        case 'Eğlence': 
          return 'tertiary';
        default: 
          return 'medium';
      }
    }

  }

