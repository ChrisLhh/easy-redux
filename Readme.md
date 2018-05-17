#### 一个让Redux更简单的轮子 --- 尚未完成

api参考自https://github.com/rematch/rematch

##### Use

###### 1、Model
```
// model.js
export const model = {
	name: 'model',
    state: {
    	count: 0
    },
    reducers: {
    	increase (state, payload) {
        	return {
            	count: state.count + payload
            }
        },
        decrease (state, payload) {
        	return {
            	count: state.count - payload
            }
        }
    },
    effects: {
    	async increaseAsync(payload, rootState) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          this.increment(payload)
        }
    }
}
```

###### 2、CreateStore
通过该方法去创建一个store，除了models参数，其他参数和redux中的createStore相同
```
// store.js
import { Provider } from 'react-redux'
import { Model } from './model'
import { createStore } from 'red-easy-redux'
let state = {
	model: {
    	count: 5
    }
}
const store = createStore({
	models: [model],
    state: state
})
export default store
```

###### 3、Dispatch
可以使用dispatch去触发相应的reducer和effect
```
import { dispatch } from 'red-easy-redux'
dispatch({type: '/model/increase', payload: 5}) // state: { model: { count: 5 } }
dispatch({type: '/model/decrease', payload: 3}) // state: { model: { count: 2 } }
dispatch({type: '/model/increaseAsync', payload: 1}) // state: { model: { count: 3 } } after delay
```
###### 4、 View
```
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { dispatch } from 'red-easy-redux'
import store from './store'
const Count = props => (
  <div>
    The count is {props.count}
    <button onClick={() => {
    	dispatch({type: '/model/increase', payload: 1})
    }}>increment</button>
    <button onClick={() => {
    	dispatch({type: '/model/increaseAsync', payload: 1})
    }}>increaseAsync</button>
  </div>
)

ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')

```
