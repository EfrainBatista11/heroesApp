import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent {

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl<string>('', {nonNullable: true}), // Ejemplo de tipado
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  // quemado, se debe buscar al backend
  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' }, // desc es la descripción
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(private heroesService: HeroesService){}

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit():void {
    if (this.heroForm.invalid) return; // Invalido no hacemos nada

    if (this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
      .subscribe( hero => {
        // TODO: mostrar snackbar
      });
      return;
    }

    this.heroesService.addHero(this.currentHero)
    .subscribe( hero => {
      // TODO: mostrar snackbar, y navegar a /heroes/edit/hero.id
    });
  }
}
