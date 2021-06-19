import { User } from '../interfaces';
import PureLink from './PureLink';

type Props = {
  data: User;
};

const ListItem = ({ data }: Props): JSX.Element => (
  <PureLink
    href="/users/[id]"
    as={`/users/${data.id}`}
    text={data.id + ': ' + data.name}
  />
);

export default ListItem;
