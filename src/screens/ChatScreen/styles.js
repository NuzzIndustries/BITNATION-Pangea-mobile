import { MediaQueryStyleSheet } from 'react-native-responsive';
import Colors from '../../global/Colors';

const styles = MediaQueryStyleSheet.create({
  container: {
    flex: 1,
  },
  composer: {
    backgroundColor: Colors.getBitNationLightBlue(0.2),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    color: Colors.white,
    paddingLeft: 4,
    marginRight: 5,
  },
  inputToolbar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingRight: 5,
  },
});

export default styles;