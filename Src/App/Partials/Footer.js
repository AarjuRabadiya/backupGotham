import React from 'react'
import styled from 'styled-components'
import * as variable from 'Base/Variables'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { media } from 'Base/Media'

const Footer = styled.header`
    display: flex;
    width: 100vw;
    justify-content:space-around;
    background-color:${variable.black};
    justify-content: space-between;
    position:static;
    border-bottom: 1px solid #eeeeee;
    padding: ${variable.spacingSmall};
    z-index:99;
    overflow:hidden;
    flex-direction:column;

    ${media.tablet`
        align-items:center;
        flex-direction:row;
        padding: ${variable.spacingSmall} ${variable.spacingLarger};
    `};

`;

const Nav = styled.nav`
    display:flex;
`;

const Menu = styled.ul`
    display:flex;
    flex-direction:column;
    margin-top:${variable.spacingSmall};

    ${media.tablet`
        flex-direction:row;
        margin-top:0;
    `};
`;

const MenuItem = styled.li``;

const MenuLink = styled(Link)`
    color:${variable.white};
    font-family:${variable.primaryFontFamily};
    text-decoration:none;
    font-size:${variable.textLarge};

    ${media.tablet`
        margin-left:${variable.spacingMedium};
    `};
`;

const Brand = styled(Link)`
    color:${variable.white};
    font-size:${variable.titleSmaller};
    font-family:${variable.primaryFontFamily};
    text-decoration:none;
`;

@inject('animationStore')
export default class FooterContainer extends React.Component {
	constructor(props) {
        super(props)
        this.state = {
            navOpen : true,
            navFixed: false
        }
    }
	render = (props) => {
        return (
            <Footer {...props} >
                <Brand to="/">themoviejudge</Brand>
                    <Nav>
                        <Menu>
                            <MenuItem>
                                <MenuLink to="/" delay={0}>news</MenuLink>
                            </MenuItem>
                            <MenuItem>
                                <MenuLink to="/about/" delay={0}>reviews</MenuLink>
                            </MenuItem>
                            <MenuItem>
                                <MenuLink to="/users/">contact</MenuLink>
                            </MenuItem>
                        </Menu>
                    </Nav>
            </Footer>
		);
	}
}
