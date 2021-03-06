import React from 'react'
import { Card } from 'semantic-ui-react'

const CardBack = (props) => 
  <Card onClick={props.handleClick}>
    <Card.Content>
      <Card.Description>{props.movie.overview}</Card.Description>
    </Card.Content>
  </Card>

export default CardBack