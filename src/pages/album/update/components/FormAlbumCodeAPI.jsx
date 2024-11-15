import React, { useState, Fragment } from 'react';
import {
  Form,
  Select,
  Spin,
  Input,
} from 'antd';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormAlbumCodeAPI = props => {
  const {
    form,
    isLabel,
    isName,
    isList,
    setIsList,
    isDisabled,
    meAlbumCode,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    return new Promise((resolve, reject) => {
      setIsFetching(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        commFn.searchOption(keyword, '/Album', (res) => {
          setIsList(res);
          setIsFetching(false);
          resolve(res);
        }, [{ key: 'precise', value: '0' }]);
      }, 200);
    });
  }

  return (
    <Fragment>
      <Form.Item
        label={isLabel}
        name={isName}
      >
        <Select
          disabled={isDisabled}
          showSearch
          optionFilterProp="children"
          optionLabelProp="label"
          filterOption={false}
          allowClear
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          onSearch={(value) => {
            searchOption(value);
          }}
          onChange={(value, option) => {
            // when click clearIcon, clear 'isList' data
            if (!value) {
              setIsList([]);
            }

            if (option) {
              form.setFieldsValue({ original_album_id: option.albumid });
            } else {
              form.setFieldsValue({ original_album_id: '' });
            }
          }}
          onFocus={() => {
            setIsList([]);
            searchOption(form.getFieldValue()[isName]);
          }}
          onSelect={(value, option) => {
            searchOption(option.label);
          }}
        >
          {isList.filter(fD => fD.album_code != meAlbumCode).map(d => (
            <Option
              key={d.album_code}
              label={d.album_code}
              albumid={d.id}
            >
              {d.album_code}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="original_album_id"
        style={{ display: 'none' }}
      >
        <Input />
      </Form.Item>
    </Fragment >
  );
}

export default FormAlbumCodeAPI;
