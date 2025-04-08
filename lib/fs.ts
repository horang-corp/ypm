export type CallbackFsClient = {
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
	 */
	readFile: Function;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
	 */
	writeFile: Function;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback
	 */
	unlink: Function;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback
	 */
	readdir: Function;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_mkdir_path_mode_callback
	 */
	mkdir: Function;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_rmdir_path_callback
	 */
	rmdir: Function;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback
	 */
	stat: Function;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_lstat_path_options_callback
	 */
	lstat: Function;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_readlink_path_options_callback
	 */
	readlink?: Function | undefined;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_symlink_target_path_type_callback
	 */
	symlink?: Function | undefined;
	/**
	 * - https://nodejs.org/api/fs.html#fs_fs_chmod_path_mode_callback
	 */
	chmod?: Function | undefined;
};
export type PromiseFsClient = {
	promises: {
		readFile: Function;
		writeFile: Function;
		unlink: Function;
		readdir: Function;
		mkdir: Function;
		rmdir: Function;
		stat: Function;
		lstat: Function;
		readlink?: Function | undefined;
		symlink?: Function | undefined;
		chmod?: Function | undefined;
	};
};
export type FsClient = CallbackFsClient | PromiseFsClient;
