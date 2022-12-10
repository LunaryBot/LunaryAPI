import BitField from '../../../utils/BitField';
import * as Constants from '../../../utils/contants/Constants';

type UserFeature = keyof typeof Constants.UserFeatures;

class UserFeatures extends BitField<UserFeature> {
	public static Flags = Constants.UserFeatures;
}

export { UserFeatures };