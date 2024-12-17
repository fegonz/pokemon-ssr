import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { PokemonListSkeletonComponent } from "./ui/pokemon-list-skeleton/pokemon-list-skeleton.component";
import { PokemonService } from '../../pokemons/services/Pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { delay, map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { SimplePokemon } from '../../pokemons/interfaces';
@Component({
  selector: 'app-pokemons-page',
  standalone: true,
  imports: [
    CommonModule,
    PokemonListComponent,
    PokemonListSkeletonComponent
],
  templateUrl: './pokemons-page.component.html',
  styleUrl: './pokemons-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit{
  public pokemons = signal<SimplePokemon[]>([]);
  private pokemonsService = inject(PokemonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);

  public isLoading = signal(true);
  ngOnInit(): void {

    this.loadPokemons();
    setTimeout(()=>{
      this.isLoading.set(false);

     },1500)
     this.route.queryParamMap.subscribe(console.log)
  }
  public currentPage = toSignal<number>(
    this.route.queryParamMap.pipe(
      map((params) => params.get('page') ?? '1'),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );
  public loadPokemons(page=0) {
    const pageToLoad = this.currentPage()! + page;

    // console.log({ pageToLoad, currentPage: this.currentPage() });

    this.pokemonsService
    .loadPage(pageToLoad)
    .pipe(
      tap(() =>
        this.router.navigate([], { queryParams: { page: pageToLoad } })
      ),
      tap(() => this.title.setTitle(`Pokémons SSR - Page ${pageToLoad}`))
    )
    .subscribe((pokemons) => {
      this.pokemons.set(pokemons);
    });
  }

}
