import Game from "./Game";

class Program {
  public static Main(): void {
    let game = new Game();
    game.CreateScene("renderCanvas");
    game.DoRender();
  }
}

// Debug version
Program.Main();

// Release version
// window.onload = () => { Program.Main(); }
