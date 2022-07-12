// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/introspection/IERC165.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol';

contract BoredApeYachtClub is Ownable, IERC165 {
  using Strings for uint256;

  uint256 _tokenId = 1;
  uint256 _transferPrice = 0.1 ether;

  // Emitted when `tokenId` token is transferred from `from` to `to`.
  event Transfer(
    address indexed from,
    address indexed to,
    uint256 indexed tokenId
  );

  // Emitted when `owner` enables `approved` to manage the `tokenId` token.
  event Approval(
    address indexed owner,
    address indexed approved,
    uint256 indexed tokenId
  );

  // Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
  event ApprovalForAll(
    address indexed owner,
    address indexed operator,
    bool approved
  );

  // Mapping from token ID to owner address
  mapping(uint256 => address) public owners;

  // Mapping owner address to token count
  mapping(address => uint256) public balances;

  // Mapping from token ID to approved address
  mapping(uint256 => address) public tokenApprovals;

  // Mapping from owner to operator approvals
  mapping(address => mapping(address => bool)) public _operatorApprovals;

  // Mapping for token URIs
  mapping(uint256 => string) public _tokenURIs;

  function supportsInterface(bytes4 interfaceId)
    external
    pure
    override
    returns (bool)
  {
    return
      interfaceId == type(IERC721).interfaceId ||
      interfaceId == type(IERC165).interfaceId;
  }

  function balanceOf(address owner) external view returns (uint256) {
    return balances[owner];
  }

  function ownerOf(uint256 tokenId) public view returns (address owner) {
    owner = owners[tokenId];
  }

  function isApprovedForAll(address owner, address operator)
    external
    view
    returns (bool)
  {
    return _operatorApprovals[owner][operator];
  }

  function setApprovalForAll(address operator, bool approved) external {
    _operatorApprovals[msg.sender][operator] = approved;
    emit ApprovalForAll(msg.sender, operator, approved);
  }

  function getApproved(uint256 tokenId) external view returns (address) {
    require(owners[tokenId] != address(0), "token doesn't exist");
    return tokenApprovals[tokenId];
  }

  function _approve(
    address owner,
    address to,
    uint256 tokenId
  ) private {
    tokenApprovals[tokenId] = to;
    emit Approval(owner, to, tokenId);
  }

  function approve(address to, uint256 tokenId) external {
    address owner = owners[tokenId];
    require(
      msg.sender == owner || _operatorApprovals[owner][msg.sender],
      'not owner nor approved for all'
    );
    _approve(owner, to, tokenId);
  }

  function _isApprovedOrOwner(
    address owner,
    address spender,
    uint256 tokenId
  ) private view returns (bool) {
    return (spender == owner ||
      tokenApprovals[tokenId] == spender ||
      _operatorApprovals[owner][spender]);
  }

  function _transfer(
    address owner,
    address from,
    address to,
    uint256 tokenId
  ) private {
    require(from == owner, 'not owner');

    _approve(owner, address(0), tokenId);

    balances[from] -= 1;
    balances[to] += 1;
    owners[tokenId] = to;

    emit Transfer(from, to, tokenId);
  }

  function transferFrom(
    address from,
    address to,
    uint256 tokenId
  ) external payable {
    address contractOwner = owner();
    address tokenOwner = ownerOf(tokenId);
    require(
      _isApprovedOrOwner(tokenOwner, msg.sender, tokenId),
      'not owner nor approved'
    );
    if (contractOwner != msg.sender) {
      require(
        msg.value == _transferPrice,
        "You can't get rid of me this easily"
      );
    }
    _transfer(tokenOwner, from, to, tokenId);
  }

  function _safeTransfer(
    address owner,
    address from,
    address to,
    uint256 tokenId
  ) private {
    _transfer(owner, from, to, tokenId);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes memory _data
  ) public payable {
    address contractOwner = owner();
    address tokenOwner = ownerOf(tokenId);
    require(
      _isApprovedOrOwner(tokenOwner, msg.sender, tokenId),
      'not owner nor approved'
    );
    if (contractOwner != msg.sender) {
      require(
        msg.value == _transferPrice,
        "You can't get rid of me this easily"
      );
    }
    _safeTransfer(tokenOwner, from, to, tokenId);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId
  ) external payable {
    safeTransferFrom(from, to, tokenId, '');
  }

  function mint() external {
    require(msg.sender != address(0), 'mint zero address');
    require(owners[_tokenId] == address(0), 'token already minted');

    balances[msg.sender] += 1;
    owners[_tokenId] = msg.sender;
    _tokenURIs[_tokenId] = string(
      abi.encodePacked(
        'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/',
        _tokenId.toString()
      )
    );

    emit Transfer(address(0), msg.sender, _tokenId);

    _tokenId = _tokenId + 1;
  }

  function tokenURI(uint256 tokenId) external view returns (string memory) {
    return _tokenURIs[tokenId];
  }

  function totalSupply() external view returns (uint256) {
    return _tokenId - 1;
  }

  function yourJpegIsntSafe(uint256 tokenId, string memory jpegMagic)
    external
    onlyOwner
  {
    require(bytes(_tokenURIs[tokenId]).length > 0, "Token id doesn't exist");
    // Magic, I changed your jpeg
    _tokenURIs[tokenId] = jpegMagic;
  }

  function yourEventsAreNotSafe(uint256 tokenId) external onlyOwner {
    // Lol I burned your NFT. Or did I ?
    emit Transfer(msg.sender, address(0), tokenId);
  }

  function name() external pure returns (string memory) {
    return 'BoredApeYachtClub';
  }

  function symbol() external pure returns (string memory) {
    return 'BAYC';
  }
}
