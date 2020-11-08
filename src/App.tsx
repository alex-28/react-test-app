import React from 'react';
import { Route, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu as MenuAntd } from 'antd';

const _Menu: React.FC<RouteComponentProps> = (props) => {
  const menu = [
    {
      title: 'Home',
      to: '/',
    },
    {
      title: 'About',
      to: '/about',
    },
    {
      title: 'Items List',
      to: '/items',
    },
  ];
  const menuItem = menu.find((item) => item.to === props.location.pathname);
  return (
    <MenuAntd selectedKeys={menuItem ? [menuItem.to] : []} mode="horizontal" theme="dark">
      {menu.map((item) => (
        <MenuAntd.Item key={item.to}>
          <Link to={item.to}>{item.title}</Link>
        </MenuAntd.Item>
      ))}
    </MenuAntd>
  );
};

const Menu = withRouter(_Menu);

const _Item: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  return <div>id-{props.match.params.id}-item</div>;
};

const Item = withRouter(_Item);

export const App: React.FC = () => {
  return (
    <div>
      <Menu />
      <div style={{ fontSize: '20px' }}>
        <Route exact path="/" component={() => <h1>Home page</h1>} />
        <Route exact path="/about" component={() => <h1>About page</h1>} />
        <Route
          exact
          path="/items"
          component={() => (
            <div>
              {[1, 2, 3].map((item) => (
                <Link to={`items/${item}`}>{item}</Link>
              ))}
            </div>
          )}
        />
        <Route exact path="/items/:id" component={Item} />
      </div>
    </div>
  );
};
