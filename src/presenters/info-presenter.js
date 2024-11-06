import { render } from "../framework/render";
import AdvantagesView from "../views/advantages-view";
import HeroView from "../views/hero-view";
import MissionView from "../views/mission-view";

export default class InfoPresenter {
  #heroView = new HeroView();
  #missionView = new MissionView();
  #advantagesView = new AdvantagesView();
  #container = null;

  constructor(container) {
    this.#container = container
  }

  initalize = () => {
    render(this.#heroView, this.#container);
    render(this.#missionView, this.#container);
    render(this.#advantagesView, this.#container);
  }
}
