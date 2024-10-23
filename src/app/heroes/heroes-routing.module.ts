import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './page/layout-page/layout-page.component';
import { NewPageComponent } from './page/new-page/new-page.component';
import { SearchPageComponent } from './page/search-page/search-page.component';
import { ListPageComponent } from './page/list-page/list-page.component';
import { HeroPageComponent } from './page/hero-page/hero-page.component';

// localhost:4200/heroes/''
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'new-hero', component: NewPageComponent},
      { path: 'search', component: SearchPageComponent},
      { path: 'edit/:id', component: NewPageComponent},
      { path: 'list', component: ListPageComponent},
      // Esta siempre al final porque es un comodín, todas las de arriba 
      // concuerda con esta si se coloca arriba.
      { path: ':id', component: HeroPageComponent},
      { path: '**', redirectTo: 'list'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
