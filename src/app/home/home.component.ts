import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { Feedback } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { flyInOut, expand } from '../animations/app.animation';

import { CarouselComponent } from '../carousel/carousel.component';
import { CarouselItemDirective } from '../carousel/carousel-item.directive';
import { CarouselItemElementDirective } from '../carousel/carousel-item-element.directive';

//import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {


  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promoErrMess: string;
  leaderErrMess: string;
  feedback: Feedback;
  feedbackErrMess: string;

  feedbacks: Feedback[];



  slides = [
            {image: "/assets/images/finalimages/homeimage.jpeg"},
            {image: "/assets/images/finalimages/searchandclick.jpeg"},
            {image: "/assets/images/finalimages/reservethebook.jpeg"},
            {image: "/assets/images/finalimages/contactownercollectstart.jpeg"},
            {image: "/assets/images/finalimages/lendandmakeavailable.jpeg"},
            {image: "/assets/images/finalimages/addandremove.jpeg"}];

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderservice: LeaderService,private feedbackservice: FeedbackService,
    @Inject('baseURL') private baseURL ) {}

  ngOnInit() {
    /*this.dishservice.getFeaturedDish()
      .subscribe(dish => this.dish = dish,
        errmess => this.dishErrMess = <any>errmess);*/
    /*this.promotionservice.getFeaturedPromotion()
      .subscribe(promotion => this.promotion = promotion,
        errmess => this.promoErrMess = <any>errmess);*/
    /*this.leaderservice.getFeaturedLeader()
      .subscribe(leader => this.leader = leader,
        errmess => this.leaderErrMess = <any>errmess);*/
      this.feedbackservice.getFeaturedFeedback()
      .subscribe(feedbacks => this.feedbacks = feedbacks,
        errmess => this.feedbackErrMess = <any>errmess)

  }

}
