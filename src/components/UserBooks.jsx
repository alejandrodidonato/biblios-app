import React from 'react'
import useBook from '../hooks/useBook';
import { Link, Outlet, useNavigate } from 'react-router-dom';



const UserBooks = () => {

  const { bookData, loading, userBooks, userSearched } = useBook()

  return (
        <>
        <Container fluid className="mt-4">
                <Row className='mb-3'>
                  <Col>
                    <h2 className='h2-profile'>Mi Biblioteca</h2>
                  </Col>
                </Row>
                <Row xs={3} md={4} lg={6} className="g-1 justify-content-center mx-1">
                {Array.from(userBooks).map((item,index) => (

                    <Col key={index}>
                            <Card>
                                <Card.Img variant="middle" src={item.image} />
                            </Card>
                    </Col>
                ))}
                </Row>
            </Container>
            <Container fluid className="mt-4">
                <Row className='mb-3'>
                  <Col>
                    <h2 className='h2-profile'>Mis Buscados</h2>
                  </Col>
                </Row>
                <Row xs={3} md={4} lg={6} className="g-1 justify-content-center mx-1">
                {Array.from(userSearched).map((item,index) => (

                    <Col key={index}>
                            <Card>
                                <Card.Img variant="middle" src={item.image} />
                            </Card>
                    </Col>
                ))}
                </Row>
            </Container>
        </>
  )
}

export default UserBooks