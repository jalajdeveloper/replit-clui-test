import React from 'react';
import Controls from '../Controls';
import PromptIcon from '../PromptIcon';
import Row from '../Row';
import data from '../data.json';

const City = ({ cities, country, states }) => {
  console.log('cities', cities);
  return (
    <table>
      <thead>
        <tr>
          <th>Country</th>
          <th>State</th>
          <th>Cities</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data)
          .filter(
            it => it !== 'description' && it !== 'commands' && it !== 'run'
          )
          .map(it => (
            <tr>
              <td>{country}</td>
              <td>
                {Object.keys(states)
                  .filter(
                    fit =>
                      fit !== 'description' &&
                      fit !== 'commands' &&
                      fit !== 'run'
                  )
                  .join(',')}
              </td>
              <td>
                {cities.map(ct => ct = ct.area)
                  .join(',')}
              </td>
            </tr>
          ))}
      </tbody>
      <style jsx>
        {`
          table tr {
            background: black;
          }
        `}
      </style>
    </table>
  );
};

export default search => {
  console.log('search', search);
  return {
    description: 'City List',
    commands: {
      list: {
        description: 'List all cities',
        path: ['clui', 'city', 'list'],
        commands: async (query) => {
          const dataItems = data;
          Object.keys(dataItems).map(item => {
            console.log('item', item);
            if(query === 'india'){
                dataItems[item] = {
                  ...dataItems[item],
                  description: `Country list of ${item}`,
                  commands: {
                    states: {
                      description: `State list of ${item}`,
                      commands: async (query) => {
                          console.log("query", query)
                        Object.keys(dataItems[item])
                          .filter(
                            fit =>
                              fit !== 'description' &&
                              fit !== 'commands' &&
                              fit !== 'run'
                          )
                          .map(it => {
                            dataItems[item][it] = {
                              ...dataItems[item][it],
                              description: `${it} cities`,
                              run: () => (
                                <City
                                  cities={dataItems[item][it]?.data}
                                  states={dataItems[item]}
                                  country={item}
                                />
                              )
                            };
                          });
                        return dataItems[item];
                      }
                    }
                  }
                };
            }else {
                dataItems[item] = {
                    ...dataItems[item],
                    description: `Country list of ${item}`,
                    run: () => <City country={item} states={[]} cities={dataItems[item]?.data}  />
                }
            }
            return item;
          });
          return dataItems;
        }
      }
    }
  };
};
