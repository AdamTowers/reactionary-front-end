import { Form, Input } from 'semantic-ui-react'
import React from 'react'

const MessageForm = (props) => {
  return (
    <Form id="message-form" onSubmit={props.sendMessage.bind(this)}>
      <Input placeholder='Your message here' action='Send'/>
    </Form>
  )
}

export default MessageForm
