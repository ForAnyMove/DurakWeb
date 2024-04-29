const solitaireHTMLevels = [
  `<div class="story-mode-level-container" id="story-mode-level-1">
    <div class="story-mode-cards-container first-column first-column">
      <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <div class="story-mode-cards-container second-column">
      <div id="sol-slot-02<[07]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-07" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <div class="story-mode-cards-container third-column">
      <div id="sol-slot-03<[08]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-08" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <div class="story-mode-cards-container fourth-column">
      <div id="sol-slot-04<[09]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-09" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <div class="story-mode-cards-container fifth-column">
      <div id="sol-slot-05<[10]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-10" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <style>
      .story-mode-level-container {
        display: flex;
        justify-content: space-between;
        width: 80%;
      }

      .story-mode-cards-container {
        display: flex;
        flex-direction: column-reverse;
      }

      .story-mode-cards-container>.card-element:not(:first-child) {
        margin-bottom: -6vw;
      }

      .first-column>.card-element:not(:first-child) {
        transform: translate(30%);
      }

      .second-column>.card-element:not(:first-child) {
        transform: translate(15%);
      }

      .third-column>.card-element:not(:first-child) {
        /* transform: translate(0%); */
      }

      .fourth-column>.card-element:not(:first-child) {
        transform: translate(-15%);
      }

      .fifth-column>.card-element:not(:first-child) {
        transform: translate(-30%);
      }
    </style>
  </div>`, // 0 +
  `<div class="story-mode-level-container" id="story-mode-level-2">
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed" style="
          position: relative;
          left: 0px;
          top: 0px;
        "></div>
    <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed" style="
          position: relative;
          left: 0px;
          top: 0px;
        "></div>
    <div id="sol-slot-03" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-04" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-05" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container fourth-column">
    <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container fifth-column">
    <div id="sol-slot-07" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container sixth-column">
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed" style="
          position: relative;
          left: 0px;
          top: 0px;
        "></div>
    <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed" style="
          position: relative;
          left: 0px;
          top: 0px;
        "></div>
    <div id="sol-slot-10" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin-bottom: 11vh;
    }

    .story-mode-cards-container {
      display: flex;
      flex-direction: column-reverse;
    }

    .story-mode-cards-container>.card-element:not(:first-child) {
      margin-bottom: -6vw;
    }
    .first-column, .sixth-column{
      margin-bottom: -7vh;
    }
    .first-column>.card-element:not(:first-child) {
      transform: translate(30%);
    }
    .first-column>.card-element:last-child {
      transform: translate(60%);
    }

    .second-column {
      transform: translate(30%);
    }

    .third-column {
      transform: translate(10%);
    }

    .fourth-column {
      transform: translate(-10%);
    }

    .fifth-column {
      transform: translate(-30%);
    }

    .sixth-column>.card-element:not(:first-child) {
      transform: translate(-30%);
    }
    .sixth-column>.card-element:last-child {
      transform: translate(-60%);
    }
    @media screen and (orientation: portrait) {
      .story-mode-level-container {
        margin-bottom: 5vh;
      }

      .story-mode-cards-container>.card-element:not(:first-child) {
        margin-bottom: -10vw;
      }
      .first-column, .sixth-column{
        margin-bottom: -4vw;
      }
    }
  </style>
</div>`, // 1 +
  `<div class="story-mode-level-container" id="story-mode-level-3">
<div class="story-mode-cards-container first-column">
  <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-02" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container second-column">
  <div id="sol-slot-03<[05]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-04<[05]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-05" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container third-column">
  <div id="sol-slot-06<[08]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-07<[08]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-08" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container fourth-column">
  <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-10" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<style>
  .story-mode-level-container {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin-bottom: 11vh;
  }

  .story-mode-cards-container {
    display: flex;
    flex-direction: column-reverse;
  }

  .story-mode-cards-container>.card-element:not(:first-child) {
    margin-bottom: -4vw;
  }
  .first-column>.card-element:not(:first-child) {
    transform: translate(50%);
  }
  .second-column{
    margin-right: -8vw;
  }
  .second-column>.card-element:not(:first-child) {
    transform: translate(-100%);
    margin-bottom: 0;
  }
  .second-column>.card-element:last-child {
    transform: translate(-50%);
    margin-bottom: -12vw;
  }
  .third-column>.card-element:not(:first-child) {
    transform: translate(100%);
    margin-bottom: 0;
  }
  .third-column>.card-element:last-child {
    transform: translate(50%);
    margin-bottom: -12vw;
  }
  .fourth-column>.card-element:not(:first-child) {
    transform: translate(-50%);
  }
  @media screen and (orientation: portrait) {
    .first-column>.card-element:not(:first-child),
    .fourth-column>.card-element:not(:first-child) {
      margin-bottom: -6vw;
    }
    .second-column>.card-element:last-child {
      margin-bottom: -17vw;
    }
    .third-column>.card-element:last-child {
      margin-bottom: -17vw;
    }
  }
</style>
</div>`, // 2 +
  `<div class="story-mode-level-container" id="story-mode-level-4">
<div class="story-mode-cards-container first-column">
  <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-03<[04]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-04" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container second-column">
  <div id="sol-slot-05<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container third-column">
  <div id="sol-slot-07<[08]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-10" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<style>
  .story-mode-level-container {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin-bottom: 1vh;
  }

  .story-mode-cards-container {
    display: flex;
    flex-direction: column-reverse;
  }

  .story-mode-cards-container>.card-element:not(:first-child) {
    margin-bottom: -6.3vw;
  }
  .first-column>.card-element:nth-child(2) {
    transform: translate(50%);
  }
  .first-column>.card-element:nth-child(3) {
    transform: translate(100%);
  }
  .first-column>.card-element:nth-child(4) {
    transform: translate(150%);
  }
  .second-column>.card-element:nth-child(2) {
    margin-bottom: -4vw;
  }
  .third-column>.card-element:nth-child(2) {
    transform: translate(-50%);
  }
  .third-column>.card-element:nth-child(3) {
    transform: translate(-100%);
  }
  .third-column>.card-element:nth-child(4) {
    transform: translate(-150%);
  }
  @media screen and (orientation: portrait) {
    .story-mode-cards-container>.card-element:not(:first-child) {
      margin-bottom: -9.5vw;
    }
    .second-column>.card-element:nth-child(2) {
      margin-bottom: -5vw;
    }
  }
</style>
</div>`, // 3 +
  `<div class="story-mode-level-container" id="story-mode-level-5">
<div class="story-mode-cards-container first-column">
  <div id="sol-slot-01<[05,06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-02<[06,07]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
</div>
<div class="story-mode-cards-container second-column">
  <div id="sol-slot-03<[05,06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-04<[06,07]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
</div>
<div class="story-mode-cards-container third-column">
  <div id="sol-slot-05" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
  <div id="sol-slot-07" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<style>
  .story-mode-level-container {
    display: flex;
    justify-content: center;
    width: 80%;
    margin-bottom: 1vh;
    position: relative;
  }

  .story-mode-cards-container {
    display: flex;
    flex-direction: column-reverse;
  }

  .story-mode-cards-container>.card-element:not(:first-child) {
    margin-bottom: 0.3vw;
  }

  .first-column {
    position: absolute;
    transform: rotate(45deg);
  }

  .first-column>.card-element:nth-child(2),
  .second-column>.card-element:nth-child(2) {
    margin-bottom: 6vw;
  }

  .second-column {
    position: absolute;
    transform: rotate(-45deg);
  }

  .third-column {
    margin-top: -2vw;
  }

  @media screen and (orientation: portrait) {

    .first-column>.card-element:nth-child(2),
    .second-column>.card-element:nth-child(2) {
      margin-bottom: 10vw;
    }
  }
</style>
</div>`, // 4 +
  `<div class="story-mode-level-container" id = "story-mode-level-6" >
<div class="story-mode-cards-container first-column">
  <div id="sol-slot-01<[05]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-02<[05]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-03<[05]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-04<[05]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-05" class="sol-slot card-element opened removed"></div>
</div>
<div class="story-mode-cards-container second-column">
  <div id="sol-slot-06<[10]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-07<[10]" class="sol-slot card-element closed removed" ></div>
  <div id="sol-slot-08<[10]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
</div>
<style>
  .story-mode-card-zone{
    height: 60%;
  }
  .story-mode-level-container {
    display: flex;
    justify-content: space-evenly;
    width: 60%;
    margin-bottom: 1vh;
    position: relative;
  }

  .story-mode-cards-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 14vw;
    gap: 1vh;
    position: relative;
  }

  .story-mode-cards-container>.card-element:last-child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media screen and (orientation: portrait) {
    .story-mode-cards-container{
      width: 20vw;
    }
    .story-mode-level-container{
      margin-bottom: 0;
    }
  }
</style>
</div>`, // 5 + // phone fix require
  `<div class="story-mode-level-container" id = "story-mode-level-7" >
<div class="story-mode-cards-container first-column">
  <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-03" class="sol-slot card-element opened removed"></div>
</div>
<div class="story-mode-cards-container second-column">
  <div id="sol-slot-04<[06]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-05<[06]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed"></div>
  <div id="sol-slot-07" class="sol-slot card-element opened removed"></div>
</div>
<div class="story-mode-cards-container third-column">
  <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed"></div>
  <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
</div>
<style>
  .story-mode-level-container {
    display: flex;
    justify-content: space-evenly;
    width: 80%;
    margin-bottom: 1vh;
    position: relative;
  }

  .story-mode-cards-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column-reverse;
    width: 14vw;
    gap: 1vh;
    position: relative;
  }

  .first-column>.card-element:not(:first-child),
  .third-column>.card-element:not(:first-child) {
    margin-bottom: -11vh;
  }
  .first-column>.card-element:first-child {
    transform: rotate(-45deg) translate(-4vw, -2vw);
  }
  .third-column>.card-element:first-child {
    transform: rotate(45deg) translate(4vw, -2vw);
  }
  .first-column>.card-element:nth-child(2) {
    transform: rotate(-35deg) translate(-2vw, -1vw);
  }
  .third-column>.card-element:nth-child(2) {
    transform: rotate(35deg) translate(2vw, -1vw);
  }
  .first-column>.card-element:nth-child(3) {
    transform: rotate(-25deg);
  }
  .third-column>.card-element:nth-child(3) {
    transform: rotate(25deg);
  }
  .second-column{
    flex-direction: column;
    row-gap: 2vw;
    transform: translateY(2vw);
  }
  .second-column>.card-element:nth-child(1){
    position: absolute;
    top: 32%;
    left: calc(50% - 4vw);
    transform: translate(-50%, -50%);
  }
  .second-column>.card-element:nth-child(2){
    position: absolute;
    top: 32%;
    left: calc(50% + 4vw);
    transform: translate(-50%, -50%);
  }

  @media screen and (orientation: portrait) {
    .first-column>.card-element:not(:first-child),
    .third-column>.card-element:not(:first-child) {
      margin-bottom: -5vh;
    }
  }
</style>
</div> `, // 6 +
  `<div class="story-mode-level-container" id = "story-mode-level-8" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03<[04]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-04" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-05<[06]" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-06<[06]" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-07<[08]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-card-zone{
      height: 60%;
    }
    .story-mode-level-container {
      display: flex;
      justify-content: space-evenly;
      width: 60%;
      margin-bottom: 1vh;
      position: relative;
    }

    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .second-column{
      flex-direction: column;
      gap: 1vw;
      margin: 0 2vw;
    }
    .third-column{
      flex-direction: row-reverse;
    }
    .first-column>.card-element,
    .third-column>.card-element{
      margin: 0 -1.5vw;
    }
    .first-column>.card-element:nth-child(1){
      transform: translateY(-4.5vw);
    }
    .first-column>.card-element:nth-child(2){
      transform: translateY(-3vw);
    }
    .first-column>.card-element:nth-child(3){
      transform: translateY(-1.5vw);
    }
    .third-column>.card-element:nth-child(1){
      transform: translateY(4.5vw);
    }
    .third-column>.card-element:nth-child(2){
      transform: translateY(3vw);
    }
    .third-column>.card-element:nth-child(3){
      transform: translateY(1.5vw);
    }

    @media screen and (orientation: portrait) {
      .first-column>.card-element,
      .third-column>.card-element{
        margin: 0 -2vw;
      }
      .first-column>.card-element:nth-child(1){
        transform: translateY(-4.5vw);
      }
      .first-column>.card-element:nth-child(2){
        transform: translateY(-3vw);
      }
      .first-column>.card-element:nth-child(3){
        transform: translateY(-1.5vw);
      }
      .third-column>.card-element:nth-child(1){
        transform: translateY(4.5vw);
      }
      .third-column>.card-element:nth-child(2){
        transform: translateY(3vw);
      }
      .third-column>.card-element:nth-child(3){
        transform: translateY(1.5vw);
      }
    }
  </style>
</div> `, // 7 +
  `<div class="story-mode-level-container" id = "story-mode-level-9" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-04<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-05<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-06" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-07" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: space-evenly;
      width: 45%;
      margin-bottom: 1vh;
      position: relative;
    }

    .story-mode-cards-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column-reverse;
      width: 14vw;
      gap: 1vh;
      position: relative;
    }

    .first-column>.card-element:not(:first-child),
    .third-column>.card-element:not(:first-child) {
      margin-bottom: -10vh;
    }
    .first-column>.card-element:first-child {
      transform: rotate(-65deg) translate(-4vw, -2vw);
    }
    .third-column>.card-element:first-child {
      transform: rotate(65deg) translate(4vw, -2vw);
    }
    .first-column>.card-element:nth-child(2) {
      transform: rotate(-50deg) translate(-2vw, -1vw);
    }
    .third-column>.card-element:nth-child(2) {
      transform: rotate(50deg) translate(2vw, -1vw);
    }
    .first-column>.card-element:nth-child(3) {
      transform: rotate(-30deg);
    }
    .third-column>.card-element:nth-child(3) {
      transform: rotate(30deg);
    }
    .second-column{
      flex-direction: column;
      row-gap: 4vw;
      transform: translateY(5vw);
    }
    .second-column>.card-element:nth-child(1){
      transform: translateY(21vw);
    }
    .second-column>.card-element:nth-child(2){
      transform: translateY(15vw);
    }

    @media screen and (orientation: portrait) {
      .first-column>.card-element:not(:first-child),
      .third-column>.card-element:not(:first-child) {
        margin-bottom: -5vh;
      }
      .second-column{
        row-gap: 5vw;
      }
      .second-column>.card-element:nth-child(1){
        transform: translateY(29vw);
      }
      .second-column>.card-element:nth-child(2){
        transform: translateY(21vw);
      }
    }
  </style>
</div> `, // 8 +
  `<div class="story-mode-level-container" id = "story-mode-level-10" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02,04]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-03<[05]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-04<[06]" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-05" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-06<[07,04]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-07" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: space-evenly;
      width: 40%;
      margin-bottom: 1vh;
      position: relative;
    }

    .story-mode-cards-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column-reverse;
      width: 14vw;
      gap: 1vh;
      position: relative;
    }

    .first-column>.card-element:first-child {
      transform: rotate(45deg) translate(-2vw, -7vw);
    }
    .third-column>.card-element:first-child {
      transform: rotate(-45deg) translate(2vw, -7vw);
    }
    .first-column>.card-element:nth-child(2) {
      transform: translate(-2vw, 4vw);
    }
    .third-column>.card-element:nth-child(2) {
      transform: translate(2vw, 4vw);
    }
    .second-column{
      flex-direction: column;
      row-gap: 2vw;
      z-index: 1;
    }
    .second-column>.card-element:nth-child(1){
      transform: translateY(23vw);
    }

    @media screen and (orientation: portrait) {
      .story-mode-level-container{
        width: 50%;
      }
      .second-column{
        row-gap: 4vw;
        transform: translateY(-2vw);
      }
      .first-column>.card-element:first-child {
          transform: rotate(45deg) translate(-5vw, -14vw);
      }
      .third-column>.card-element:first-child {
        transform: rotate(-45deg) translate(5vw, -14vw);
      }
      .second-column>.card-element:nth-child(1) {
        transform: translateY(35vw);
      }
    }
  </style>
</div> `, // 9 +
  `<div class="story-mode-level-container" id="story-mode-level-11" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[06]" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-01<[06]" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container fourth-column">
    <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container fifth-column">
    <div id="sol-slot-01<[06]" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-01<[06]" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
    justify-content: space-evenly;
    width: 40%;
    margin-bottom: 1vh;
    position: relative;
            }

    .story-mode-cards-container {
      display: flex;
    justify-content: center;
    align-items: center;
    width: 14vw;
    gap: 1vh;
    position: relative;
            }
    .first-column,
    .fifth-column{
      position: absolute;
    column-gap: 2vw;
    z-index: 2;
            }
    .first-column{
      transform: translate(-9vw, 9vw) rotate(-45deg);
            }
    .fifth-column{
      transform: translate(9vw, 9vw) rotate(45deg);
            }
    .second-column,
    .third-column,
    .fourth-column{
      flex - direction: column;
    margin: 0 -13vw;
            }
    .second-column,
    .fourth-column{
      z - index: 1;
    row-gap: 2vw;
            }
    .third-column{
      row - gap: 4vw;
            }
    @media screen and (orientation: portrait) {
              .first - column,
              .fifth - column{
      column - gap: 6vw;
              }
    .third-column{
      row - gap: 6vw;
              }
    .first-column{
      transform: translate(-15vw, 14vw) rotate(-45deg);
              }
    .fifth-column{
      transform: translate(15vw, 14vw) rotate(45deg);
              }
            }
  </style>
</div> `, // 10 // broken
  `<div class="story-mode-level-container" id="story-mode-level-12" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-02<[01,03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-04" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-05<[04,06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-06" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-07" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-08<[07,09]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-09" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container fourth-column">
    <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
    justify-content: space-evenly;
    width: 110%;
    margin-bottom: 1vh;
    position: relative;
            }

    .story-mode-cards-container {
      display: flex;
    justify-content: center;
    align-items: center;
    width: 14vw;
    column-gap: 0;
    position: relative;
            }
    .first-column{
      transform: rotate(-30deg);
            }
    .second-column{
      transform: translateY(-4vw);
            }
    .third-column{
      transform: rotate(30deg);
            }
    .fourth-column{
      position: absolute;
    transform: translate(0, 5vw);
    bottom: 0;
            }
            .first-column>.card-element:nth-child(2),
            .second-column>.card-element:nth-child(2),
            .third-column>.card-element:nth-child(2){
      transform: rotate(90deg);
            }
            .first-column>.card-element:not(:nth-child(2)),
            .second-column>.card-element:not(:nth-child(2)),
            .third-column>.card-element:not(:nth-child(2)){
      z-index: 2;
            }
    @media screen and (orientation: portrait) {
              .story - mode - cards - container {
      column - gap: 3vw;
              }
              .first-column>.card-element:nth-child(2),
              .second-column>.card-element:nth-child(2),
              .third-column>.card-element:nth-child(2){
      transform: rotate(90deg) translate(-25%, -2vw);
              }
    .second-column{
      transform: translateY(-6vw);
              }
    .fourth-column{
      transform: translate(2vw, 7vw);
              }
            }
  </style>
</div> `, // 11 +
  `<div class="story-mode-level-container" id="story-mode-level-13" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[04]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-03<[05]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-04<[05]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-05" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container fourth-column">
    <div id="sol-slot-06" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container fifth-column">
    <div id="sol-slot-07<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-08<[06]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container sixth-column">
    <div id="sol-slot-09<[07]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-10<[08]" class="sol-slot card-element closed removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
    justify-content: center;
    width: 80%;
    margin-bottom: 1vh;
    position: relative;
    column-gap: 2vw;
            }

    .story-mode-cards-container {
      display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: relative;
    row-gap: 0.5vw;
            }
    .second-column,
    .fifth-column{
      z - index: 1;
    margin: -5vw;
            }
            .second-column>.card-element:nth-child(2),
            .fifth-column>.card-element:nth-child(2){
      margin - top: -5vw;
            }
    .third-column,
    .fourth-column{
      z - index: 2;
            }
    @media screen and (orientation: portrait) {
              .second - column, .fifth - column {
      margin: -7vw;
              }
            }
  </style>
</div> `, // 12 // broken
  `<div class="story-mode-level-container" id = "story-mode-level-14" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-03<[02]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-04<[05]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-05" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-06<[05]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-07<[08]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-08" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-09<[08]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container fourth-column">
    <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: space-evenly;
      width: 100%;
      position: relative;
    }

    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 14vw;
      column-gap: 0;
      position: relative;
    }
    .first-column{
      flex-direction: column;
    }
    .first-column>.card-element{
      transform: rotate(-45deg);
      margin: -3vw;
    }
    .second-column>.card-element,
    .third-column>.card-element{
      transform: rotate(45deg);
    }
    .first-column>.card-element:nth-child(2),
    .second-column>.card-element:nth-child(2),
    .third-column>.card-element:nth-child(2){
      z-index: 1;
    }
    .fourth-column{
      position: absolute;
      bottom: -11vw;
      transform: rotate(90deg);
    }
    @media screen and (orientation: landscape) {
      .story-mode-level-container {
        margin-bottom: 3vh;
      }
      .first-column>.card-element {
        margin: -2vw;
      }
      .second-column>.card-element, .third-column>.card-element {
        margin: -1vw;
      }
      .fourth-column {
        bottom: -6vw;
      }
    }
  </style>
</div> `, // 13 +
  `<div class="story-mode-level-container" id = "story-mode-level-15" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[05,06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[05,06]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-03<[06,07]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-04<[06,07]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-05" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-06" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-07" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      position: relative;
      column-gap: 2vw;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .first-column,
    .second-column{
      flex-direction: column;
      row-gap: 1vw;
    }
    .third-column{
      column-gap: 2vw;
      position: absolute;
    }
    

    @media screen and (orientation: portrait) {

    }
  </style>
</div> `, // 14 +
  `<div class="story-mode-level-container" id = "story-mode-level-16" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-03<[02]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-04<[05]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-05" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-06" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-07<[06]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-09" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-10<[09]" class="sol-slot card-element closed removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      position: relative;
      column-gap: 5vw;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-direction: column;
      row-gap: 1vw;
    }
    .first-column>.card-element:nth-child(2),
    .third-column>.card-element:nth-child(2){
      position: absolute;
      z-index: 1;
    }
    .first-column>.card-element:nth-child(2){
      transform: translateX(3vw);
    }
    .third-column>.card-element:nth-child(2){
      transform: translateX(-3vw);
    }
    
    .second-column>.card-element:nth-child(1),
    .second-column>.card-element:nth-child(4){
      margin: -7vw auto;
      z-index: -1;
    }
    
    @media screen and (orientation: portrait) {

      .second-column>.card-element:nth-child(1),
      .second-column>.card-element:nth-child(4){
        margin: -10vw auto;
      }
    }
  </style>
</div> `, // 15 +
  `<div class="story-mode-level-container" id = "story-mode-level-17" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03<[04]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-04<[05]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-05<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-06" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-07<[08]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-10<[05]" class="sol-slot card-element closed removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      position: relative;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .second-column{
      flex-direction: column-reverse;
      z-index: 1;
    }
    .third-column{
      flex-direction: row-reverse;
    }
    .first-column>.card-element,
    .third-column>.card-element{
      margin: 0 -1.5vw -2vw;
    }
    .second-column>.card-element{
      margin: -2vw 0;
    }
    .first-column>.card-element:nth-child(1),
    .third-column>.card-element:nth-child(1){
      transform: translateY(2.5vw);
    }
    .first-column>.card-element:nth-child(2),
    .third-column>.card-element:nth-child(2){
      transform: translateY(1vw);
    }
    .first-column>.card-element:nth-child(3),
    .third-column>.card-element:nth-child(3){
      transform: translateY(-0.5vw);
    }
    .first-column>.card-element:nth-child(4),
    .third-column>.card-element:nth-child(4){
      transform: translateY(-2vw);
    }
    
    @media screen and (orientation: portrait) {
      .first-column>.card-element,
      .third-column>.card-element{
        margin: 0 -2.5vw -2vw;
      }
      .second-column>.card-element {
        margin: -3vw 0;
      }
      .first-column>.card-element:nth-child(1),
      .third-column>.card-element:nth-child(1){
        transform: translateY(3vw);
      }
      .first-column>.card-element:nth-child(2),
      .third-column>.card-element:nth-child(2){
        transform: translateY(1vw);
      }
      .first-column>.card-element:nth-child(3),
      .third-column>.card-element:nth-child(3){
        transform: translateY(-1vw);
      }
      .first-column>.card-element:nth-child(4),
      .third-column>.card-element:nth-child(4){
        transform: translateY(-3vw);
      }
    }
  </style>
</div> `, // 16 +
  `<div class="story-mode-level-container" id = "story-mode-level-18" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[08]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[09,10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03<[07]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-04<[08]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-05<[09,10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-06<[07]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-07<[10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container fourth-column">
    <div id="sol-slot-09" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-height: 100%;
      position: relative;
      flex-direction: column;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .first-column,
    .second-column{
      flex-direction: column;
      row-gap: 3vw;
      transform: rotate(90deg);
      height: 10vw;
    }
    .third-column{
      column-gap: 10vw;
      position: absolute;
    }
    .fourth-column{
      flex-direction: column;
      row-gap: 1vw;
      transform: rotate(90deg);
      position: absolute;
    }
    
    @media screen and (orientation: portrait) {
      
      .third-column{
        column-gap: 17vw;
      }
      .fourth-column{
        row-gap: 2vw;
      }
      .first-column,
      .second-column{
        row-gap: 5vw;
        height: 15vw;
      }
    }
  </style>
</div> `, // 17 + // bugged
  ` <div class="story-mode-level-container" id = "story-mode-level-19" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03<[04]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-04" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-05<[04]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-06<[07]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-07<[08]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-09" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-10<[09]" class="sol-slot card-element closed removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-height: 100%;
      position: relative;
      flex-direction: column;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .story-mode-cards-container>.card-element{
      margin: 0 -1vw;
    }
    .story-mode-cards-container>.card-element:nth-child(4){
      z-index: 1;
    }
    .first-column{
      flex-direction: row-reverse;
      transform: translateX(-3.5vw);
    }
    .second-column{
      transform: translateX(3.5vw);
    }
    
    .first-column>.card-element:not(:nth-child(4)){
      transform: rotate(20deg) translateY(-1.5vw);
    }
    .second-column>.card-element:not(:nth-child(4)){
      transform: rotate(-20deg) translateY(1.5vw);
    }
    .first-column>.card-element:last-child{
      transform: rotate(-20deg) translateY(1.5vw);
    }
    .second-column>.card-element:last-child{
      transform: rotate(20deg) translateY(-1.5vw);
    }
    @media screen and (orientation: portrait) {
      .story-mode-cards-container>.card-element{
        margin: 0 -1.5vw;
      }
      .first-column{
        transform: translateX(-5vw);
      }
      .second-column{
        transform: translateX(5vw);
      }
      .first-column>.card-element:not(:nth-child(4)){
        transform: rotate(20deg) translateY(-2vw);
      }
      .second-column>.card-element:not(:nth-child(4)){
        transform: rotate(-20deg) translateY(2vw);
      }
      .first-column>.card-element:last-child{
        transform: rotate(-20deg) translateY(2vw);
      }
      .second-column>.card-element:last-child{
        transform: rotate(20deg) translateY(-2vw);
      }
    }
  </style>
</div> `, // 18 +
  ` <div class="story-mode-level-container" id = "story-mode-level-20" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[05]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-03<[04]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-04" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-05<[04]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-06<[03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-07<[05]" class="sol-slot card-element closed removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-height: 100%;
      position: relative;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-direction: column;
    }
    .first-column,
    .third-column{
      row-gap: 5vw;
      margin: 0 -2.5vw;
    }
    .second-column{
      z-index: 1;
      transform: translateY(-0.5vw);
    }
    .second-column>.card-element{
      margin: -2vw 0;
    }
    .second-column>.card-element:nth-child(1){
      transform: translateX(-0.5vw);
    }
    .second-column>.card-element:nth-child(2){
      z-index: 1;
    }
    .second-column>.card-element:nth-child(3){
      transform: translateX(0.5vw);
    }
    
    @media screen and (orientation: portrait) {
      
      .second-column>.card-element{
        margin: -2.5vw 0;
      }
      .first-column,
      .third-column{
        row-gap: 8vw;
        margin: 0 -3.5vw;
      }
    }
  </style>
</div> `, // 19 +
  `<div class="story-mode-level-container" id = "story-mode-level-21" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03<[10]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-04<[05]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-05<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-06<[10]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-07<[08]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      width: 31%;
      max-height: 100%;
      position: relative;
      flex-direction: column;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .second-column{
      flex-direction: row-reverse;
      align-self: flex-end;
      transform: translate(30%, 0%);
    }
    .story-mode-cards-container>.card-element{
      margin-right: -3vw;
    }
    .second-column>.card-element{
      margin-right: -2vw;
    }
    .first-column>.card-element:nth-child(1){
      transform: translate(0%, 0%);
    }
    .first-column>.card-element:nth-child(2){
      transform: translate(0%, 25%);
    }
    .first-column>.card-element:nth-child(3){
      transform: translate(0%, 50%);
    }
    .second-column>.card-element:nth-child(1){
      transform: translate(0%, -50%);
    }
    .second-column>.card-element:nth-child(2){
      transform: translate(0%, -40%);
    }
    .second-column>.card-element:nth-child(3){
      transform: translate(0%, -30%);
    }
    .third-column>.card-element:nth-child(1){
      transform: translate(0%, 0%);
    }
    .third-column>.card-element:nth-child(2){
      transform: translate(0%, -15%);
    }
    .third-column>.card-element:nth-child(3){
      transform: translate(20%, -45%);
    }
    .third-column>.card-element:nth-child(4){
      transform: translate(0%, -100%);
    }
    
    @media screen and (orientation: portrait) {
      .second-column{
        transform: translate(20%, 0%);
      }
      .story-mode-cards-container>.card-element{
        margin-right: -5vw;
      }
      .second-column>.card-element{
        margin-right: -4vw;
      }
    }
  </style>
</div> `, // 20 +
  `<div class="story-mode-level-container" id = "story-mode-level-22" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[03,04]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-02<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-04<[08]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-05<[08]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-06<[09]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-07" class="sol-slot card-element opened removed"></div>
    <div id="sol-slot-08<[10]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container fourth-column">
    <div id="sol-slot-09<[07]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-10<[07]" class="sol-slot card-element closed removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 31%;
      max-height: 100%;
      position: relative;
      flex-direction: column-reverse;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      margin-top: -5vw;
      column-gap: 2vw;
    }
    .third-column>.card-element:nth-child(2){
      z-index: 1;
    }
    
    @media screen and (orientation: portrait) {
      
      .story-mode-cards-container {
        margin-top: -8vw;
        column-gap: 3vw;
      }
    }
  </style>
</div> `, // 21 +
  `<div class="story-mode-level-container" id = "story-mode-level-23" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02,03]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-02<[04]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03<[05]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-04<[07]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-05<[08]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container fourth-column">
    <div id="sol-slot-06<[04]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-07<[10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-08<[10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-09<[05]" class="sol-slot card-element closed removed"></div>
  </div>
  <div class="story-mode-cards-container fifth-column">
    <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 31%;
      max-height: 100%;
      position: relative;
      flex-direction: column-reverse;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      column-gap: 2vw;
    }
    .first-column{
      margin-top: -6vw;
    }
    .second-column{
      margin-top: -3vw;
    }
    .third-column{
      z-index: 1;
      margin-top: -4.5vw;
    }
    .fourth-column{
      margin-top: -4.5vw;
    }
    .fourth-column>.card-element:nth-child(2){
      z-index: 1;
    }
    .fourth-column>.card-element:nth-child(3){
      z-index: 1;
    }
    .third-column{
      column-gap: 9vw;
    }
    .fifth-column{
      z-index: 1;
    }
    
    @media screen and (orientation: portrait) {
      
      .story-mode-cards-container {
        column-gap: 3vw;
      }
      .first-column{
        margin-top: -8vw;
      }
      .second-column{
        margin-top: -5vw;
      }
      .third-column{
        z-index: 1;
        margin-top: -6vw;
        column-gap: 14vw;
      }
      .fourth-column{
        margin-top: -6vw;
      }
    }
  </style>
</div> `, // 22 +
  `<div class="story-mode-level-container" id = "story-mode-level-24" >
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-03<[04]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-04" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-05<[06]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-06" class="sol-slot card-element opened removed"></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-07<[08]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed"></div>
    <div id="sol-slot-10" class="sol-slot card-element opened removed"></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 31%;
      max-height: 100%;
      position: relative;
      flex-direction: column;
    }
    .story-mode-cards-container {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .first-column>.card-element,
    .third-column>.card-element{
      margin-right: -3vw;
    }
    .second-column{
      flex-direction: column;
      transform: rotate(90deg) translateY(-25%);
      height: 6vw;
      margin: 0.5vw;
    }
    .second-column>.card-element{
      margin-bottom: -3vw;
    }
    .third-column{
      flex-direction: row-reverse;
      transform: translateX(-25%);
    }
    
    @media screen and (orientation: portrait) {
      .first-column>.card-element, 
      .third-column>.card-element {
        margin-right: -4.5vw;
      }
      .second-column{
        height: 8.5vw;
        margin: 0.5vw;
      }
      .second-column>.card-element {
        margin-bottom: -4vw;
      }

    }
  </style>
</div> `, // 23 +
]

export { solitaireHTMLevels }
