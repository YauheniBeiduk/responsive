import { Menu, MenuBar, MenuItem, MenuItemContainer } from '@/ui/menu';
import { UserProfile } from './user-profile';

export const MainMenu = () => {
  return (
    <Menu>
      <MenuBar>
        <MenuItemContainer>
          <MenuItem tooltip="Profile">
            <UserProfile />
          </MenuItem>
        </MenuItemContainer>
      </MenuBar>
    </Menu>
  );
};
