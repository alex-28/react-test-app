import React from 'react';
import { Route, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu as MenuAntd, Spin, Button } from 'antd';

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
    <MenuAntd selectedKeys={menuItem ? [menuItem.to] : []} mode='horizontal' theme='dark'>
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

interface INews {
  id: number;
  title: string;
}

export interface IParams {
  [key: string]: string | number;
}

const prepareUrl = (url: string, params?: IParams) => {
  if (!params) {
    return url;
  }

  const questionIndex = url.indexOf('?');
  let paramsStr = '';

  if (questionIndex === -1) {
    paramsStr += '?';
  }

  paramsStr += Object.keys(params)
    .map((key) => {
      if (params[key]) {
        return `${key}=${encodeURIComponent(params[key])}`;
      }

      return null;
    })
    .filter((item) => item)
    .join('&');

  return url + paramsStr;
};

class HttpProvider {
  get<T>(url: string, params?: IParams): Promise<T> {
    const newUrl = prepareUrl(url, params);
    return this.send(newUrl, 'GET');
  }

  post<T>(url: string, data: Partial<T>): Promise<T> {
    return this.send(url, 'POST', data);
  }

  patch<T>(url: string, data: Partial<T>): Promise<T> {
    return this.send(url, 'PATCH', data);
  }

  delete(url: string): Promise<{}> {
    return this.send(url, 'DELETE');
  }

  private send<T>(url: string, method: string, data?: T) {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  }
}

export const App: React.FC = () => {
  return (
    <div>
      <Menu />
      <div style={{ fontSize: '20px' }}>
        <Route exact path='/' component={() => <h1>Home page</h1>} />
        <Route exact path='/about' component={() => <h1>About page</h1>} />
        <Route
          exact
          path='/items'
          component={() => {
            const [news, setNews] = React.useState<INews[]>([]);

            React.useEffect(() => {
              fetch('https://news-json.herokuapp.com/news')
                .then((res) => res.json())
                .then((newsList) => setNews(newsList));
            }, []);

            const onAdd = () => {
              const item = {
                title: 'hello',
              };

              new HttpProvider()
                .post<INews>('https://news-json.herokuapp.com/news', item)
                .then((res) => {
                  setNews([...news, res]);
                });
            };

            if (!news.length) {
              return <Spin spinning size='large' style={{ margin: 20 }} />;
            }

            return (
              <div style={{ margin: 20 }}>
                <div>newsList</div>
                {news.map((item) => (
                  <Link style={{ display: 'block' }} to={`items/${item.id}`} key={item.id}>
                    {item.title}-{item.id}
                  </Link>
                ))}
                <br />
                <Button onClick={onAdd}>Add news item</Button>
              </div>
            );
          }}
        />
        <Route exact path='/items/:id' component={Item} />
      </div>
    </div>
  );
};
