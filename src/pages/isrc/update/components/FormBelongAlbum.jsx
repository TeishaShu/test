import React, { Fragment, useState } from 'react';
import {
  Form,
  Select,
  Input,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormBelongAlbum = props => {
  const {
    form,
    isLabel,
    isName,  // db: album.id
    isSelectText,
    isList,
    setIsList,
    countryLabel,  // db: authorized_country.country_name_zh
    setCountryLabel,
    CodeLabel,  // db: album.code
    setCodeLabel,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/Album', (res) => {
        setIsList(res);
        setIsFetching(false);
      }, [{ key: 'precise', value: '0' }]);
    }, 200);
  }

  return (
    <Fragment>
      <Form.Item
        label={isLabel}
        name={isName}
      >
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
          onChange={(value, option) => {
            let obj = {};

            // when click clearIcon, clear 'isList' data
            if (!value) {
              setIsList([]);
            }

            if (option) {
              obj[isSelectText] = option.label;
              form.setFieldsValue(obj);
              setCountryLabel(option.textcountry);
              setCodeLabel(option.textcode);
            } else {
              obj[isSelectText] = '';
              form.setFieldsValue(obj);
              setCountryLabel('');
              setCodeLabel('');
            }
          }}
          onFocus={() => {
            setIsList([]);
            searchOption(form.getFieldValue()[isSelectText]);
          }}
          onSelect={(value, option) => {
            searchOption(option.label);
          }}
        >
          {isList.map(d => (
            <Option
              key={d.id}
              label={d.album_name_zh}
              textcode={d.album_code}
              textcountry={d.release_country}
              textcountrycode={d.country_code_short}
            >
              {`${d.album_name_zh} (${d.album_code} | ${d.release_country} | ${d.country_code_short})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <label className={styles.searchLabelForLeft}>{(countryLabel) ? (countryLabel) : ''}</label>
      <label className={styles.searchLabel}>{(CodeLabel) ? `(${CodeLabel})` : ''}</label>
    </Fragment >
  );
}

export default FormBelongAlbum;