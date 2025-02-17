import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit{

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

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) return; // No se incluye 'edit', no se hace nada

    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.heroesService.getHeroById(id)),
    ).subscribe( hero => {
        if (!hero) {return this.router.navigateByUrl('/');}

        this.heroForm.reset( hero ); // El reset sirve también para establecer los valores al formulario
        return;
    });
  }

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit():void {
    if (this.heroForm.invalid) return; // Invalido no hacemos nada

    if (this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
      .subscribe( hero => {
        this.showSnackbar(`${ hero.superhero} actualizado!`);
      });
      return;
    }

    this.heroesService.addHero(this.currentHero)
    .subscribe( hero => {
      this.router.navigate(['/hero/edit', hero.id]);
      this.showSnackbar(`${ hero.superhero} creado!`);
    });
  }

  onDeleteHero(){

    if(!this.currentHero.id) throw Error('El id del héroe es requerido');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result),
      switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id)),
      filter( (wasDeleted: boolean) => wasDeleted),
    )
    .subscribe( () => {
      this.router.navigate(['/heroes']);
    });

    // Otra forma de hacerlo, ambas están bien pero la de arriba esta más optimizada
    // dialogRef.afterClosed().subscribe(result => {
    //  if ( !result ) return;

    //  this.heroesService.deleteHeroById( this.currentHero.id)
    //  .subscribe( wasDeleted => {
    //     if (wasDeleted)
    //        this.router.navigate(['/heroes']);
    //  })
    // });
  }

  showSnackbar(message: string): void{
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}
