"use client"

import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { Link } from "react-router-dom"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { FaUser, FaHistory, FaSignOutAlt } from "react-icons/fa"
import { motion } from "framer-motion"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function UserDropdown({ logoutHandler, username }) {
  return (
    <Menu as="div" className="relative inline-block z-50 font-poppins text-left">
      {({ open }) => (
        <>
          <Menu.Button 
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white transition-colors duration-200"
          >
            <FaUser className="h-5 w-5 text-gray-600 rounded-full" />
            <ChevronDownIcon 
              className={classNames(
                "h-5 w-5 text-gray-400 transition-transform duration-200",
                open ? 'transform rotate-180' : ''
              )}
              aria-hidden="true" 
            />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/order-history"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "group flex items-center px-4 py-2 text-sm transition-colors duration-150"
                      )}
                    >
                      <FaHistory className={classNames(
                        active ? "text-gray-600" : "text-gray-400",
                        "mr-3 h-5 w-5 transition-colors duration-150"
                      )} />
                      Order History
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150"
                      )}
                    >
                      <FaSignOutAlt className={classNames(
                        active ? "text-red-600" : "text-red-400",
                        "mr-3 h-5 w-5 transition-colors duration-150"
                      )} />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}