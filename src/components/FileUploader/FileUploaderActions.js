import React from "react";
import Button from "@material-ui/core/Button";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";

import "./FileUploader.scss";

export default function FileUploaderActions(props) {
	return (
		<div className="Uploader-Actions__container">
			<button className="Uploader__download" onClick={props.downloadFile}>
				<CloudDownloadOutlinedIcon /> Скачать
			</button>
			<button className="Uploader__delete" onClick={props.deleteFile}>
				Удалить файл
			</button>
		</div>
	);
}
