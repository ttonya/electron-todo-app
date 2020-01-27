import React, { useState, useContext, useEffect, useCallback } from "react";

import FileUploaderContext, {
	FileUploaderProvider
} from "./FileUploaderContext";
import BackupOutlinedIcon from "@material-ui/icons/BackupOutlined";
import FileUploaderInfo from "./FileUploaderInfo";
import config from "../../config";
import axios from "axios";

import "./FileUploader.scss";

const FileDownload = require("js-file-download");

function FileUploader(props) {
	const context = useContext(FileUploaderContext);
	const [selectedFile, setSelectedFile] = useState(context.selectedFile);
	const [originalName, setOriginalName] = useState(context.originalName);
	const [downloadLink, setDownloadLink] = useState(context.downloadLink);
	const [isDownload, setIsDownload] = useState(context.isDownload);
	const [activeClass, setActiveClass] = useState(context.isActive);
	const [isLoading, setIsLoading] = useState(context.isLoading);

	const state = {
		selectedFile: selectedFile,
		originalName: originalName,
		downloadLink: downloadLink,
		isLoading: isLoading,
		isDownload: isDownload
	};

	const downloadFile = useCallback(name => {
		const fileInUrl = window.location.toString().split("/");
		const file = fileInUrl[fileInUrl.length - 1];
		axios
			.post(
				`${config.serverUrl}get`,
				{ originalName: name, filename: file },
				{ responseType: "blob" }
			)
			.then(response => {
				FileDownload(response.data, name);
			});
	}, []);

	const getFileData = useCallback(filename => {
		const file = filename ? filename : selectedFile;
		axios
			.post(`${config.serverUrl}getfile`, { fileName: file }, {})
			.then(file => {
				if (file && file.data) {
					downloadFile(file.data.originalName);
					setSelectedFile(file.data.originalName);
					setOriginalName(file.data.originalName);
				}
			});
	}, []);

	useEffect(() => {
		const fileInUrl = window.location.toString().split("/");
		const file = fileInUrl[fileInUrl.length - 1];
		const selected = file.length > 1 ? file : null;
		setActiveClass("Uploader-wrapper--not-active");
		if (file && selected) {
			setSelectedFile(selected);
			setDownloadLink(window.location.toString());
			setIsDownload(!!selected);
			setTimeout(() => {
				if (isDownload) {
					getFileData(selectedFile);
				}
			});
		}
	}, [getFileData, isDownload]);

	function getData() {
		axios
			.post(`${config.serverUrl}getfile`, { fileName: selectedFile }, {})
			.then(file => {
				downloadFile(file.data.originalName);
				setSelectedFile(file.data.originalName);
			});
	}

	function uploadFile(file) {
		setIsLoading(true);
		const data = new FormData();
		const fileToUpload = file ? file : selectedFile;
		setOriginalName(file.name);
		data.append("file", fileToUpload);

		axios.post(`${config.serverUrl}add`, data, {}).then(res => {
			saveFileData(res.data);
		});
	}

	function saveFileData(file) {
		let url = window.location.toString().split("/");
		url.pop();
		url = url.join("/");
		axios.post(`${config.serverUrl}upload`, file, {}).then(response => {
			setIsLoading(false);
			setSelectedFile(file.fileName);
			setDownloadLink(`${url}/${file.fileName}`);
			setIsDownload(true);
		});
	}

	function deleteFile() {
		axios
			.post(`${config.serverUrl}remove`, { filename: selectedFile }, {})
			.then(res => {
				removeFile();
				setSelectedFile(null);
				setDownloadLink(null);
				setIsDownload(false);
			});
	}

	function removeFile() {
		axios
			.post(`${config.serverUrl}delete`, { filename: selectedFile }, {})
			.then(res => {});
	}

	function changeFile(event) {
		setSelectedFile(event.target.files[0]);
		uploadFile(event.target.files[0]);
	}

	function onDrop(event) {
		if (!isDownload) {
			event.stopPropagation();
			event.preventDefault();
			setSelectedFile(event.dataTransfer.files[0]);
			uploadFile(event.dataTransfer.files[0]);
			setActiveClass("Uploader-wrapper--not-active");
		}
	}

	function onDragOver(event) {
		if (!isDownload) {
			event.stopPropagation();
			event.preventDefault();
			setActiveClass("Uploader-wrapper--active");
		}
	}

	return (
		<div>
			<div
				className={`Uploader-wrapper ${activeClass}`}
				onDragOver={onDragOver}
				onDrop={onDrop}
			>
				{isLoading && <div className="loader">Loading...</div>}
				{!isDownload && !isLoading && (
					<div className="Uploader">
						<label className="Uploader__label" htmlFor="file">
							<span className="Uploader__text"> Выбрать файл</span>
							<BackupOutlinedIcon className="Uploader__icon" />
						</label>

						<input
							className="Uploader__input"
							id="file"
							type="file"
							onChange={changeFile}
						/>
					</div>
				)}
				<div style={{ padding: "15px" }}>
					<FileUploaderProvider value={state}>
						<FileUploaderInfo
							getData={getData}
							uploadFile={uploadFile}
							deleteFile={deleteFile}
						/>
					</FileUploaderProvider>
				</div>
			</div>
		</div>
	);
}

export default FileUploader;
