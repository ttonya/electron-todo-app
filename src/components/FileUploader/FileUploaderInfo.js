import React, { useContext } from "react";
import FileUploaderActions from "./FileUploaderActions";
import FileUploaderContext from "./FileUploaderContext";

import "./FileUploader.scss";

export default function FileUploaderInfo(props) {
	const context = useContext(FileUploaderContext);

	return (
		<div>
			<div className="Uploader-info__name">
				{context.originalName && context.isDownload && (
					<span style={{ fontSize: "24px" }} title={context.originalName}>
						{context.originalName}
					</span>
				)}
			</div>
			{context.isDownload && (
				<FileUploaderActions
					downloadFile={props.getData}
					deleteFile={props.deleteFile}
				/>
			)}
			{context.isDownload && context.downloadLink && (
				<div className="Uploader-info__item">
					<span className="Uploader-info__link-header">
						{" "}
						Ссылка на скачивание:
					</span>{" "}
					<br />
					<a className="Uploader-info__link" href={context.downloadLink}>
						{context.downloadLink}{" "}
					</a>
				</div>
			)}
		</div>
	);
}
