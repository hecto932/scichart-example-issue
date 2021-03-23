import { RolloverModifier } from 'scichart/Charting/ChartModifiers/RolloverModifier';

export class CustomRolloverModifier extends RolloverModifier {

  private id: string | undefined;

  constructor(defaultOptions?: any, id?: string | undefined) {
    super(defaultOptions);

    if (id) {
      this.id = id;
    }
  }

  onDetach() {
    super.onDetach();
    if (this.id) {
      console.log(`${this.id}: CustomRolloverModifier detached!`);
    }
  }


  onAttach() {
    super.onAttach();
    if (this.id) {
      console.log(`${this.id}: CustomRolloverModifier attached!`);
    }
  }
}