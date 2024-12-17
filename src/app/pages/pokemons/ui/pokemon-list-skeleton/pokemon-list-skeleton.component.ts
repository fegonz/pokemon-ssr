import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pokemon-list-skeleton',
  standalone: true,
  imports: [
  ],
  templateUrl: './pokemon-list-skeleton.component.html',
  styleUrl: './pokemon-list-skeleton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListSkeletonComponent { }
