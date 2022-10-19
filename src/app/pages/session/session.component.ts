import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GameBenchmarkService } from "src/app/services/game-benchmark/game-benchmark.service";
import { JwtService } from "src/app/services/jwt/jwt.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"],
})
export class SessionComponent implements OnInit, OnDestroy {
  url = "";
  benchmarkId = "";
  // webcam?: MediaStream;
  @ViewChild("session") session!: ElementRef<HTMLIFrameElement>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService,
    private gameBenchmarkService: GameBenchmarkService
  ) {
    this.benchmarkId = this.route.snapshot.queryParamMap.get('benchmarkId') as string,
    this.url = environment.activityEndpoint + "?benchmarkId=" + this.benchmarkId;
  }

  ngOnDestroy() {}

  async ngOnInit() {
    window.addEventListener("message", async (event) => {
      if (event && event.data && event.data.type) {
        if (event.data.type === 'activity-experience-ready') {
          this.session.nativeElement.contentWindow?.postMessage(
            {
              type: 'token',
              token: this.jwtService.getToken(),
              benchmarkId: this.route.snapshot.queryParamMap.get('benchmarkId'),
            },
            "*"
          );
        }
        // sends a latest valid access_token.
        else if (event.data.type === 'end-game') {
          console.log('event.data.gameBenchmarkId', event.data.gameBenchmarkId);
          await this.gameBenchmarkService.updateUserConf(event.data.gameBenchmarkId as string)
          this.router.navigate(['configs/edit/', this.benchmarkId])
        }
      }

      if (event && event.data && event.data.gameBenchmarkId) {
        this.router.navigate(['configs/edit/', this.benchmarkId])
      }

      if (event && event.data && event.data.type === 'check-auth' && !event.data.token) {
        this.jwtService.clearTokens();
      }
    }, false);
  }
}
