import React from 'react'
import { History } from 'history'
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import LockIcon from '@material-ui/icons/LockOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import LogsIcon from '@material-ui/icons/ListAlt'
import SettingsIcon from '@material-ui/icons/Settings'

import ButtonLink from './ButtonLink'

import { LoaderPrototype, LoadTypes } from '../actions/loader'
import { UserDataActionsPrototypes } from '../actions/userData'

import routes from '../constants/routes.json'
import bakingController from '../utils/padaria/bakingController'

const styles = ({ spacing }: Theme) =>
  createStyles({
    root: {
      backgroundColor: 'rgb(36, 40, 55)',
      boxSizing: 'border-box',
      border: '1px solid rgb(40, 44, 61)'
    },
    grow: {
      flexGrow: 1
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    },
    buttonIcon: {
      paddingRight: spacing(1)
    }
  })

type Props = {
  userDataFunc: UserDataActionsPrototypes
  loader: LoaderPrototype
  history: History
} & WithStyles<typeof styles>

const Component: React.FC<Props> = props => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const {
    classes,
    userDataFunc: { clearUserData, loadUserData },
    loader,
    history
  } = props

  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (event: any) => {
    setAnchorEl(null)
  }

  const handleClearKeys = async () => {
    loader(LoadTypes.USER_DATA)
    await clearUserData()
    bakingController.delegate = {}
    loader(LoadTypes.USER_DATA, true)
    history.push(routes.HOME)
  }

  const handleBakerLock = async () => {
    loader(LoadTypes.USER_DATA)
    await loadUserData()
    bakingController.stop()
    loader(LoadTypes.USER_DATA, true)
  }

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-haspopup="true"
          aria-label="Menu"
          onClick={handleMenuClick}
        >
          <i className="fa fa-bars" />
        </IconButton>
        <ButtonLink
          color="inherit"
          to={routes.DASHBOARD}
          className={classes.grow}
        >
          Dashboard
        </ButtonLink>
        <ButtonLink
          color="inherit"
          to={routes.REWARDS}
          className={classes.grow}
        >
          Reward System
        </ButtonLink>
        <ButtonLink
          color="inherit"
          to={routes.MAKE_TRANSACTION}
          className={classes.grow}
        >
          Make a Transaction
        </ButtonLink>
        <IconButton
          color="inherit"
          aria-label="Settings"
          onClick={() => history.push(routes.SETTINGS)}
        >
          <SettingsIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Logs"
          onClick={() => history.push(routes.LOGS)}
        >
          <LogsIcon color="secondary" />
        </IconButton>
      </Toolbar>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleBakerLock}>
          <LockIcon className={classes.buttonIcon} /> {'Lock Account'}
        </MenuItem>
        <MenuItem onClick={handleClearKeys}>
          <DeleteIcon className={classes.buttonIcon} /> {'Clear Wallet'}
        </MenuItem>
      </Menu>
    </AppBar>
  )
}

export default withStyles(styles)(Component)
