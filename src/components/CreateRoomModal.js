import React from 'react'
import { Button, Header, Image, Modal, Form } from 'semantic-ui-react'

const CreateRoomModal = (props) => {
  return(
    <Modal trigger={<Button>Create a Room</Button>}>
      <Modal.Header>Create a Room</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Form onSubmit={props.onSubmit}>
            <Form.Field>
              <label>Room Name</label>
              <input onChange={props.onChange} />
            </Form.Field>
            <Button type='submit'>Create</Button>
          </Form>

        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default CreateRoomModal
