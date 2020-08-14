import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/interfaces';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: [ './dashboard-page.component.scss' ]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postSub: Subscription;
  delSub: Subscription;
  searchStr = '';

  constructor(
    private postService: PostService
  ) {
  }

  ngOnInit(): void {
    this.postSub = this.postService.getAll().subscribe(posts => {
      this.posts = posts;
    });
  }

  public remove( id: string ) {
    this.delSub = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(value => value.id !== id);
    })
  }

  public ngOnDestroy(): void {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }

    if (this.delSub) {
      this.delSub.unsubscribe();
    }
  }
}
