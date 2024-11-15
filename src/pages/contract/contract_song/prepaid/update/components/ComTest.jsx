import React, { Fragment, useState } from 'react';
import {
  Select,
  Spin
} from 'antd';
import commFn from '@/fn/comm';
import cusStyles from '../index.less';

const ComTest = props => {
  const [isList, setIsList] = useState([]);
  const [listVal, setListVal] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/album', (res) => {
        let tmpRes = res.map((elem => ({ value: elem.id, label: `${elem.album_name_zh}(${elem.album_code} | ${elem.release_country})` })));

        setIsList(tmpRes);
        setIsFetching(false);
      }, [{ key: 'precise', value: '0' }]);
    }, 200);
  }

  return (
    <Select
      showSearch
      optionFilterProp="children"
      optionLabelProp="label"
      filterOption={false}
      allowClear={true}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
      onSearch={(value) => {
        searchOption(value);
      }}
      mode="multiple"
      options={isList}
      value={listVal}
      onChange={(value) => {
        setListVal(value);
      }}
      style={{ width: '100%' }}
      className={cusStyles.multiSelect}
    />
  );
}

export default ComTest;