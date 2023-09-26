import {BounceIn, BounceInOut, BounceOut} from "./Bounce";
import {ElasticIn, ElasticInOut, ElasticOut} from "./Elastic";
import {BackIn, BackInOut, BackOut} from "./Back";
import {ExpoIn, ExpoInOut, ExpoOut} from "./Expo";
import {CircularIn, CircularInOut, CircularOut} from "./Circular";
import {CubicIn, CubicInOut, CubicOut} from "./Cubic";
import {QuadraticIn, QuadraticInOut, QuadraticOut} from "./Quadratic";
import {QuarticIn, QuarticInOut, QuarticOut} from "./Quartic";
import {SineIn, SineInOut, SineOut} from "./Sine";
import Linear from "./Linear";
import {QuinticIn, QuinticInOut, QuinticOut} from "./Quintic";

/**
 * Usual easing functions.
 * To customize their parameters, create new instances.
 */
namespace Easing {
  // Linear
  export const linear = Linear.INSTANCE;

  // Bounce
  export const bounceIn = BounceIn.INSTANCE;
  export const bounceOut = BounceOut.INSTANCE;
  export const bounceInOut = BounceInOut.INSTANCE;

  // Elastic
  export const elasticIn = ElasticIn.INSTANCE;
  export const elasticOut = ElasticOut.INSTANCE;
  export const elasticInOut = ElasticInOut.INSTANCE;

  // Back
  export const backIn = BackIn.INSTANCE;
  export const backOut = BackOut.INSTANCE;
  export const backInOut = BackInOut.INSTANCE;

  // Expo
  export const expoIn = ExpoIn.INSTANCE;
  export const expoOut = ExpoOut.INSTANCE;
  export const expoInOut = ExpoInOut.INSTANCE;

  // Circular
  export const circularIn = CircularIn.INSTANCE;
  export const circularOut = CircularOut.INSTANCE;
  export const circularInOut = CircularInOut.INSTANCE;

  // Cubic
  export const cubicIn = CubicIn.INSTANCE;
  export const cubicOut = CubicOut.INSTANCE;
  export const cubicInOut = CubicInOut.INSTANCE;

  // Quadratic
  export const quadraticIn = QuadraticIn.INSTANCE;
  export const quadraticOut = QuadraticOut.INSTANCE;
  export const quadraticInOut = QuadraticInOut.INSTANCE;

  // Quartic
  export const quarticIn = QuarticIn.INSTANCE;
  export const quarticOut = QuarticOut.INSTANCE;
  export const quarticInOut = QuarticInOut.INSTANCE;

  // Sine
  export const sineIn = SineIn.INSTANCE;
  export const sineOut = SineOut.INSTANCE;
  export const sineInOut = SineInOut.INSTANCE;

  // Quintic
  export const quinticIn = QuinticIn.INSTANCE;
  export const quinticOut = QuinticOut.INSTANCE;
  export const quinticInOut = QuinticInOut.INSTANCE;
}

export default Easing;