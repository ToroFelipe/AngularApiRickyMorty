import { Component, HostListener, Inject, OnInit, } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Params, Router, } from '@angular/router';
import { Character } from '@app/shared/interfaces/character.interface';
import { CharacterService } from '@app/shared/services/character.service';
import { filter, map, take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';


type RequestInfo = {
  next: string;
};


@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  info: RequestInfo = {
    next: null!,

  };

  private pageNum = 1;
  private query!: string;
  private hideScrollheight = 200;
  private showScrollheight = 500;
 


  constructor(
    private characterSvc: CharacterService,
    private route: ActivatedRoute,
    private router:Router
  ) {this.onUrlChanged();}

  ngOnInit(): void {
    this.get2();

  }
  private onUrlChanged(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.characters = [];
        this.pageNum = 1;
        this.get2();
      });
  }

  private get2(): void {
    
    this.route.queryParams.pipe(take(1)).subscribe(params=>{
      console.log('params->',params)
 this.query = params['q'];
      this.getDataFromService();
    });
  }
 
  private getDataFromService(): void {

    this.characterSvc.searchCharacter(this.query, this.pageNum)
      .pipe(take(1))
      .subscribe((res: any) => {
        if (res?.results?.length) {
          const { info, results } = res;
          this.characters = [...this.characters, ...results];
          this.info = info;
        } else {
          this.characters = [];

        }
      });
  }



}