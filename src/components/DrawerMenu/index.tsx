'use client'

import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  SwipeableDrawer,
  Toolbar,
} from '@mui/material'
import { KeyboardEvent, MouseEvent, useCallback, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu'

function DrawerContent() {
  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            hello world
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );
}

export default function DrawerMenu() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = useCallback((open: boolean) =>
    (e: KeyboardEvent | MouseEvent) => {
      if (
        e.type === 'keydown' &&
        ((e as KeyboardEvent).key === 'Tab' ||
        (e as KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerOpen(open)
    }, [])

  return (
    <>
      <IconButton
        aria-label="menu"
        onClick={toggleDrawer(true)}
        style={{ backgroundColor: 'rgba(0 0 0 / 0.7)' }}
        sx={{
          position: 'absolute',
          left: 10,
          top: 10,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <MenuIcon fontSize="medium" sx={{ color: 'white' }} />
      </IconButton>
      <SwipeableDrawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                hello world
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                hello world
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>
    </>
  )
}
