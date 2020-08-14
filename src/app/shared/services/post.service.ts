import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FbCreateResponse, Post } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor( private http: HttpClient ) {
  }

  create(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(
        map((response: FbCreateResponse) => {
          return {
            ...post,
            id: response.name,
            date: new Date(post.date)
          }
        })
      )
  }

  getAll() {
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
      .pipe(
        map((response: {[key: string]: any}) => {
          return Object
            .keys(response)
            .map(key => ({
              ...response[key],
              id: key,
              date: new Date(response[key].date)
            }))
        })
      )
  }
}
