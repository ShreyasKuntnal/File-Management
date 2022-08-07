import React from "react"
import { Container } from "react-bootstrap"
import { useFolder } from "../../hooks/useFolder"
import AddFolderButton from "./AddFolderButton"
import AddFileButton from "./AddFileButton"
import Folder from "./Folder"
import File from "./File"
import Navbar from "./Navbar"
import FolderBreadcrumbs from "./FolderBreadcrumbs"
import { useParams, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
// import { Menu, , MenuButton, SubMenu} from "@szhsin/react-menu";
import "../../CSS/menu_css.css";
import { ContextMenu,MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { render } from 'react-dom'

import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage();

// // Create a reference to the file to delete
const desertRef = ref(storage, 'images/desert.jpg');

// // Delete the file
// deleteObject(desertRef).then(() => {
//   // File deleted successfully
// }).catch((error) => {
//   // Uh-oh, an error occurred!
// });

// let imageRef = storage.refFromURL(URL);
// imageRef.delete()

const deleteFromFirebase = (url) => {
  //1.
  let pictureRef = storage.refFromURL(url);
 //2.
  pictureRef.delete()
    // .then(() => {
    //   //3.
    //   setImages(allImages.filter((image) => image !== url));
    //   alert("Picture is deleted successfully!");
    // })
    .catch((err) => {
      console.log(err);
    });
};

const ID = 'ID'

const handleClick = (event, data) => {
  console.log(`clicked`, { event, data })
}

const attributes = {
  className: 'custom-root',
  disabledClassName: 'custom-disabled',
  dividerClassName: 'custom-divider',
  selectedClassName: 'custom-selected'
}

export default function Dashboard() {
  const { folderId } = useParams()
  const { state = {} } = useLocation()
  const { userprop }= useAuth()
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder)

  return (
    <>
      <Navbar />
      <Container fluid>
        <div className="d-flex align-items-center">
          <FolderBreadcrumbs currentFolder={folder} />
          {userprop!=null && userprop.role=="student" && <AddFileButton currentFolder={folder} >Add File</AddFileButton> }
          <AddFolderButton currentFolder={folder} />
        </div>
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map(childFolder => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <ContextMenuTrigger id={ID}>
                <Folder folder={childFolder} />
            </ContextMenuTrigger>  
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map(childFile => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              > 
              <ContextMenuTrigger id={ID}>
              <File file={childFile} />
            </ContextMenuTrigger>
            <ContextMenu id={ID}>
            <MenuItem
              data={{ action: 'Open' }}
              onClick={handleClick}
              attributes={attributes}
            >
              Open
            </MenuItem>
            <MenuItem
              data={{ action: 'Rename' }}
              onClick={handleClick}
              attributes={attributes}
            >
              Rename
            </MenuItem>
            <MenuItem divider />
            <MenuItem
              data={{ action: 'Delete' }}
              onClick={handleClick}
              attributes={attributes}
            >
              {/* <button onClick={() => deleteFromFirebase(childFile)}>
               Delete
              </button> */}
              Delete
            </MenuItem>
            </ContextMenu>

              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
